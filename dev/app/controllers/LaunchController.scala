package controllers

import play.api.mvc._
import play.api._
import play.api.Logger
import play.api.i18n._
import javax.inject.Inject
import models._
import play.api.data._
import play.api.data.Forms._
import scala.sys.process._
import java.util.Date
import java.io._
import java.text.SimpleDateFormat
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test._
import java.io.{ FileWriter, FileOutputStream, File }
import controllers._
import play.api.libs.Files.TemporaryFile
import play.api.mvc.MultipartFormData.FilePart
import java.nio.file.attribute.PosixFilePermission._
import java.nio.file.attribute.PosixFilePermissions
import java.nio.file.{ Files, Path }
import java.nio.file.Paths
import java.util
import akka.stream.IOResult
import akka.stream.scaladsl._
import akka.util.ByteString
import akka.actor._
import akka.stream.Materializer

import play.api.libs.streams._
import play.api.mvc.MultipartFormData.FilePart
import play.api.libs.streams.Accumulator
import play.core.parsers.Multipart.FileInfo
import scala.concurrent.Future
import java.io.ByteArrayOutputStream
import play.api.libs.iteratee.Iteratee
import play.api.mvc.{ BodyParser, MultipartFormData }
import scala.concurrent.ExecutionContext.Implicits.global
import play.core.parsers.Multipart
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import akka.util.ByteString
import java.nio.file.attribute.BasicFileAttributes
import akka.stream.scaladsl.{ FileIO, Sink }
import akka.stream.scaladsl.FileIO
import java.nio.file.StandardOpenOption
import akka.stream.SinkShape
import akka.NotUsed
import reflect.io._
import play.api.libs.json._

import slick.dbio
import slick.dbio.Effect.Read
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import scala.sys.process._
import scala.concurrent.Await
import scala.concurrent.duration
import scala.util.{ Failure, Success }
import scala.concurrent.duration.Duration
import play.api.cache._
import play.api.libs.json._

class LaunchController @Inject() (implicit system: ActorSystem, materializer: Materializer, val messagesApi: MessagesApi, userModel: UserModel, imageModel: ImageModel, pipelineModel: PipelineModel, envModel: EnvModel, cache: CacheApi) extends Controller with I18nSupport {
  
  def loginUser = Action { implicit request =>
    
    val jsonData=request.body.asFormUrlEncoded
    val typeVal = jsonData.get("type")(0)
    val idVal = jsonData.get("id")(0)    
    val pwdVal = jsonData.get("pwd")(0)    
    if(typeVal == "login") {
      val loginData=User(0,idVal,"",pwdVal)
      val checkVal = userModel.retrieve(loginData,1)
      if(checkVal.length == 0) {
        Ok("check id or password")
      } else {       
        Ok("success").withSession("uId"-> idVal, "pwd"-> pwdVal)
      }      
    } else {
       val emailVal = jsonData.get("email")(0)
       val loginData = User(0, idVal,emailVal, pwdVal)       
      userModel.insert(loginData)
      val sftp=Seq("sftp-useradd.sh",idVal,pwdVal)
      Process(sftp).run
      Ok("success")
      .withSession("uId"->idVal, "pwd"-> pwdVal)
    }
  }
  
  def idDupCheck = Action { implicit request =>
    val Data = request.body.asFormUrlEncoded.get.get("id").get(0)
    val userData=User(0,Data,"","")
    val foundId = userModel.retrieve(userData,2)    
    if(foundId.length != 0) {
      Ok("1")
    } else {
      Ok("0")
    } 
  }
  def logoutUser = Action { implicit request => Redirect(routes.PageController.loginPage()).withNewSession }
  
  def jobDupCheck= Action{ implicit request =>
    val jobData = request.body.asFormUrlEncoded.get.get("jobName").get(0)
    val foundjob= imageModel.retrieve(jobData,1)
    if(foundjob.length!=0) {
      Ok("1")
    } else {
      Ok("0")
    } 
  }
  
  def bundleDupCheck= Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get.get("bundleName").get(0)
    val foundBundle=envModel.bundleTableRetrieve(data, 4)
    if(foundBundle.length !=0){
      Ok("1")
    }
    else
      Ok("0")
  }
  
    def exeDupCheck= Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get.get("exeName").get(0)
    val foundExe=envModel.exeTableRetrieve(data, 4)
    if(foundExe.length !=0){
      Ok("1")
    }
    else
      Ok("0")
  }

    def getImageTable(limit:Int) = Action { implicit request =>
    val imageData = imageModel.joinTableRetrieve(request.session.get("uId").getOrElse("none"),"",limit);
    val jsonArray =  imageData.map { x => 
             Json.obj("pIndex" -> x._1.pIndex, "imgName" -> x._1.imgName, "jobName" -> x._1.jobName, "jobType" -> x._1.jobType, "parentInfo" -> x._1.parentInfo,
                 "status" -> x._1.status, "date" -> x._1.date, "uId" -> x._1.uId, "log" -> {if(!x._2.isEmpty) x._2.get.log; else ""}, "script" -> {if(!x._2.isEmpty) x._2.get.script; else ""})       
       }    
     val json = JsArray(jsonArray)
     Ok(json.toString())
  }
     def getSearchTable(flag:Int, value:String) = Action { implicit request =>      
      val imageData = imageModel.joinTableRetrieve(request.session.get("uId").getOrElse("none"),value,flag)
      val jsonArray =  imageData.map { x => 
          Json.obj("pIndex" -> x._1.pIndex, "imgName" -> x._1.imgName, "jobName" -> x._1.jobName, "jobType" -> x._1.jobType, "parentInfo" -> x._1.parentInfo,
                 "status" -> x._1.status, "date" -> x._1.date, "uId" -> x._1.uId, "log" -> {if(!x._2.isEmpty) x._2.get.log; else ""}, "script" -> {if(!x._2.isEmpty) x._2.get.script; else ""})
     } 
      val json = JsArray(jsonArray)
     Ok(json.toString())
  }
     def getBundleTable(limit:Int) = Action { implicit request =>
       val bundleData = envModel.bundleTableRetrieve("", limit);
       val jsonArray = bundleData.map { x => Json.obj("bundleName" -> x.bundleName, "description" -> x.description, "uId" -> x.uId ) }
       val json = JsArray(jsonArray)
       Ok(json.toString())
     }
       def getBundleSearchTable(flag:Int, value:String) = Action { implicit request =>
      val bundleData = envModel.bundleTableRetrieve(value, flag)
      val jsonArray =  bundleData.map { x => 
         Json.obj("bundleName" -> x.bundleName, "description"->x.description,"uId" -> x.uId)
      }
      val json = JsArray(jsonArray)
     Ok(json.toString())
    }
      def getExeTable(limit:Int) = Action { implicit request =>
       val exeData = envModel.exeTableRetrieve("", limit);
       val jsonArray = exeData.map { x => Json.obj("exeName" -> x.exeName, "description" -> x.description, "uId" -> x.uId) }
       val json = JsArray(jsonArray)
       Ok(json.toString())
     }
       def getExeSearchTable(flag:Int, value:String) = Action { implicit request =>
      val exeData = envModel.exeTableRetrieve(value, flag)
      val jsonArray =  exeData.map { x => 
         Json.obj("exeName" -> x.exeName, "description"->x.description,"uId" -> x.uId)
      }
      val json = JsArray(jsonArray)
     Ok(json.toString())
    }
    
    
    def getDefaultConf= Action{implicit request =>
      val userData=User(0,"admin","","")
      val result=userModel.retrieve(userData, 2)
      Ok(result(0).uEmail)
      
    }

  type FilePartHandler[A] = FileInfo => Accumulator[ByteString, FilePart[A]]
  def handleFilePartAsFile(size:String,conf:String): FilePartHandler[File] = {
    case FileInfo(partName, filename, contentType) =>     
      val sizeJson= Json.parse(size)
      val filesize= (sizeJson \ filename).as[Long]      
      val config= Json.parse(conf)
      val jobName = (config \ "jobName").as[String]
      val pipeline= (config \ "pipeline").as[String]
      //// 
      val jobType ="Normal"
      val parentInfo = ""
      val cpu = (config \ "cpu").as[String]
      val mem = (config \ "mem").as[String]
      val uId = (config \"uId").as[String]
      val path= "/nfsdir/"+(config \ "uId").as[String]+"/"+jobName
      val currentDate=(new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss")).format(new Date).toString()
      val uri = (config \ "uri").as[String]
      val imageData=Image(0,uri+":5000/"+jobName,jobName,jobType,parentInfo,"FileUploading",currentDate,uId)
      val tmpPipelineData=TmpPipeline(jobName,"",pipeline)
      if(imageModel.retrieve(jobName, 1).isEmpty){
        imageModel.insert(imageData);
        imageModel.insertTmpPipeline(tmpPipelineData)        
        Process("mkdir -p " + path).run
        Process("chmod 777 " + path).run
      }
      
      val filepath = Paths.get("/nfsdir/"+uId+"/"+filename+"_"+jobName)
      val filesink: Sink[ByteString, Future[IOResult]] = FileIO.toPath(filepath, Set(StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE))
      val accumulator = Accumulator(filesink)
      
      accumulator.map {
        case IOResult(count, status) =>{
          
          if(filesize==count){
            FilePart(partName, filename+"_"+jobName, contentType, filepath.toFile())
          }
           else{
             imageModel.update(jobName,"FileUploadFail")
             WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"FileUploadFail","data"->"null")), uId)
             Logger.debug("nononoonon")
             Process("rm -rf " +path).run
             FilePart(partName, "no", contentType, filepath.toFile())
           }
        }
      }(play.api.libs.concurrent.Execution.defaultContext)
  }
  
  def uploadCustom(size:String, conf:String) = Action{parse.multipartFormData(handleFilePartAsFile(size,conf), 100000000000L)}{ request =>
      val config= Json.parse(conf)
      val pipeline =(config \ "pipeline").as[String]
      val jobName = (config \ "jobName").as[String]
      val uId = (config \"uId").as[String]
      val path= "/nfsdir/"+(config \ "uId").as[String]
      val cpu= (config \ "cpu").as[String]
      val mem= (config \ "mem").as[String]
      val uri= (config \ "uri").as[String]
      var str=""
      
    val fileOption = request.body.file("file").map {
    case FilePart(key, filename, contentType, file) =>
      if(filename!="no"){
        writingDockerfile(uri,jobName,path)
        writingDockerJson(uri,jobName,path,cpu,mem)
        writingInnerSh(filename,pipeline,path,uId,jobName,uri)
         if(imageModel.retrieve("Running",2).length>=4){
          imageModel.update(jobName,"Pending")
          WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"Pending","data"-> pipeline)), uId)
          str="Pending"
        }
        else{          
          imageModel.update(jobName,"Running")
          WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"Running","data"->pipeline)), uId)
          val launch=Seq("launch.sh",jobName,path+"/jobName",uri)
          Process(launch).run

          str="Running"
          }               
        Logger.debug("upload success")
     }
    else{
        Logger.debug("upload fail");
        WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"FileUploadFail","data"->"null")), uId)
        str="FileUploadFail"
     }
    }
      Ok(str)
  }

  //////////////////////
  ////
  
   def handleFilePartAsBundleFile(size:String,conf:String): FilePartHandler[File] = {
    case FileInfo(partName, filename, contentType) =>     
      val config= Json.parse(conf)
      val bundleName =(config \ "bundleName").as[String]
      val description=(config \ "description").as[String]
      val uId = (config \ "uId").as[String]      
        
      val sizeJson= Json.parse(size)
      val bundlesize= (sizeJson \ filename).as[Long]
      
      val bundlepath = Paths.get("/nfsdir/bundle/"+bundleName)
      val bundlesink: Sink[ByteString, Future[IOResult]] = FileIO.toPath(bundlepath, Set(StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE))
      val accumulator = Accumulator(bundlesink)
      
      val bundleData = Bundle(bundleName,description,uId)
      envModel.insertBundle(bundleData)
      accumulator.map {        
        case IOResult(count, status) =>{
          if(bundlesize==count){
            FilePart(partName, bundleName, contentType, bundlepath.toFile())
          }
           else{
             Process("rm -rf /nfsdir/bundle/"+bundleName).run
             envModel.deleteBundle(bundleName)
             FilePart(partName, "no", contentType, bundlepath.toFile())
           }
        }
      }(play.api.libs.concurrent.Execution.defaultContext)
  }
  
  def uploadCustomBundle(size:String, conf:String) = Action{parse.multipartFormData(handleFilePartAsBundleFile(size,conf), 100000000000L)}{ request =>
    val config= Json.parse(conf)
    val bundleName =(config \ "bundleName").as[String]
    val description=(config \ "description").as[String]
    val uId = (config \ "uId").as[String]
      
      
    val fileOption = request.body.file("file").map {
    case FilePart(key, filename, contentType, file) =>
      if(filename=="no"){
        envModel.deleteBundle(bundleName)  
      }

    }
    Ok("asdf")
  }
  
  
     def handleFilePartAsExeFile(size:String,conf:String): FilePartHandler[File] = {
    case FileInfo(partName, filename, contentType) =>     
      val config= Json.parse(conf)
      val exeName =(config \ "exeName").as[String]
      val description=(config \ "description").as[String]
      val uId = (config \ "uId").as[String]      
        
      val sizeJson= Json.parse(size)
      val exesize= (sizeJson \ filename).as[Long]
      
      val exepath = Paths.get("/nfsdir/exe/"+exeName)
      val exesink: Sink[ByteString, Future[IOResult]] = FileIO.toPath(exepath, Set(StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE))
      val accumulator = Accumulator(exesink)
      
      val exeData = Exe(exeName,description,uId)
      envModel.insertExe(exeData)
      accumulator.map {        
        case IOResult(count, status) =>{
          if(exesize==count){
            FilePart(partName, exeName, contentType, exepath.toFile())
          }
           else{
             Process("rm -rf /nfsdir/exe/"+exeName).run
             envModel.deleteExe(exeName)
             FilePart(partName, "no", contentType, exepath.toFile())
           }
        }
      }(play.api.libs.concurrent.Execution.defaultContext)
  }
  
  def uploadCustomExe(size:String, conf:String) = Action{parse.multipartFormData(handleFilePartAsExeFile(size,conf), 100000000000L)}{ request =>
    val config= Json.parse(conf)
    val exeName =(config \ "exeName").as[String]
    val description=(config \ "description").as[String]
    val uId = (config \ "uId").as[String]
      
      
    val fileOption = request.body.file("file").map {
    case FilePart(key, filename, contentType, file) =>
      if(filename=="no"){
        envModel.deleteExe(exeName)  
      }

    }
    Ok("asdf")
  }
  
  
///  
///////////////////////////
  def success = Action{
    implicit request =>
      val urlencode = request.body.asFormUrlEncoded
      val jobName=urlencode.get("jobName")(0)
      val uId = urlencode.get("uId")(0)
      val fileName =urlencode.get("fileName")(0)
      val filePath= urlencode.get("filePath")(0)
      val path=filePath+"/"+jobName
      val uri = urlencode.get("uri")(0)
      Process("rm -rf "+path+"/"+fileName).run
      Process("rm -rf "+path+"/docker.json").run
      Process("rm -rf "+path+"/Dockerfile").run
      Process("rm -rf "+path+"/innerSh.sh").run
      Process("cp -r "+path+"/"+jobName+" /log/").run
      Process("mv -f "+path+" /home/"+uId+"/").run
      Process("rm -rf "+filePath+"/"+fileName).run
      imageModel.update(jobName,"Success")
     
      try{
        var log=""
      for(line <- scala.io.Source.fromFile("/log/"+jobName).mkString){
          log+=line
        } 
        Logger.debug("aaa"+ log)
        imageModel.updateTmpPipeline(jobName, log)
         WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"Success","data"->log)), uId)      
      } catch {
        case ex: Exception => println(ex)
      }
      val pendingJob=imageModel.retrieve("Pending", 2)
      if(pendingJob.length>=1){
        imageModel.update(pendingJob(0).jobName, "Running")
        val launch=Seq("launch.sh",pendingJob(0).jobName,"/nfsdir/"+pendingJob(0).uId+"/"+pendingJob(0).jobName,uri)
        Process(launch).run
        WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->pendingJob(0).jobName,"status"->"Running","data"->"null")),pendingJob(0).uId)
      }
      
      Ok("\njob success\n")
  }
  def fail = Action{
    implicit request =>
       val jobName =(request.body.asJson.get.\("job")).as[String]     
       val job=imageModel.retrieve(jobName, 1)
       val uId = job(0).uId
       val filePath = "/nfsdir/"+uId+"/"+jobName
       val sqlite=Seq("sqlite3", "/shellscript/ichthys.db","select uEmail from user where uId='admin';")
       val log= Process(sqlite).!!
       Process("cp -r "+filePath+"/"+jobName+" /log/").run
       Process("rm -rf "+filePath).run
       imageModel.update(jobName,"Fail")      
       
       try{
         var log=""
        for(line <- scala.io.Source.fromFile("/log/"+jobName).mkString){
          log+=line
        }
        imageModel.updateTmpPipeline(jobName, log)
        WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->jobName,"status"->"Fail","data"->log)), uId)      
      } catch {
        case ex: Exception => println(ex)
        }
       val pendingJob=imageModel.retrieve("Pending", 2)
      if(pendingJob.length>=1){
        imageModel.update(pendingJob(0).jobName, "Running")
        val launch=Seq("launch.sh",pendingJob(0).jobName,"/nfsdir/"+pendingJob(0).uId+"/"+pendingJob(0).jobName,log)
        Process(launch).run
        WebSocketActor.sendMessage(Json.stringify(Json.obj("jobName"->pendingJob(0).jobName,"status"->"Running","data"->"null")),pendingJob(0).uId)
      }
      Ok("aa")
  }

 
  private def writingDockerfile(uri:String, jobName:String, filePath: String ) = {
    val bw = new BufferedWriter(new FileWriter(filePath +"/"+jobName+ "/Dockerfile"))
    bw.write("FROM "+uri+":5000/baseimage")
    bw.newLine()
    bw.write("WORKDIR " + filePath + "/"+jobName)
    bw.newLine()
    bw.close()
  }
  private def writingInnerSh(fileName: String, pipeline:String, filePath: String,uId:String, jobName:String, uri:String) = {
    val bw = new BufferedWriter(new FileWriter(filePath +"/"+jobName+ "/innerSh.sh"))
    bw.write("#! /bin/sh")
    bw.newLine()
    bw.write("set -e")
    bw.newLine()
    bw.write("set -x")
//    bw.newLine()
//    bw.write("BWA=/exe/bwa")
//    bw.newLine()
//    bw.write("SAMTOOLS=/exe/samtools")
//    bw.newLine()
//    bw.write("GATK=/exe/GenomeAnalysisTK.jar")
//    bw.newLine()
//    bw.write("PICARD=/exe/picard.jar")
//    bw.newLine()
    bw.write("ln "+filePath+"/"+fileName+" "+filePath+"/"+jobName+"/"+fileName)
    bw.newLine()
    //bw.write("cp -r /exe/* "+filePath+"/")
    //bw.newLine()
    pipeline.split("\\r?\\n").map { line => bw.write(line);bw.newLine() }
    bw.write("curl -X POST --data-urlencode 'jobName="+jobName+"' --data-urlencode 'uId="+uId+"' --data-urlencode 'fileName="+fileName+"' --data-urlencode 'filePath="+filePath+"' --data-urlencode 'uri="+uri+"' http://"+uri+":9001/success")
    bw.newLine()
    bw.close()
    Process("chmod 777 "+filePath+"/"+jobName+"/innerSh.sh").run
  }
 private def writingDockerJson(uri:String,jobName:String,filePath:String,cpu:String,mem:String){
    val bw = new BufferedWriter(new FileWriter(filePath + "/"+jobName+"/docker.json"))
    bw.write("{")
    bw.newLine()
    bw.write("\"schedule\": \"R1/2014-09-25T17:22:00Z/PT2M\",")
    bw.newLine()
    bw.write("\"name\":\""+jobName+"\",")
    bw.newLine()
    bw.write("\"container\": {")
    bw.newLine()
    bw.write("\"type\": \"DOCKER\",")
    bw.newLine()
    bw.write("\"image\":\""+uri+":5000/"+jobName+"\"," )
    bw.newLine()
    bw.write("\"network\": \"BRIDGE\",")
    bw.newLine()
    bw.write("\"volumes\": [")
    bw.newLine()
    bw.write("{")
    bw.newLine()
    bw.write("\"containerPath\": \"/nfsdir\",")
    bw.newLine()
    bw.write("\"hostPath\": \"/nfsdir\",")
    bw.newLine()
    bw.write("\"mode\":\"RW\"")
    bw.newLine()
    bw.write("}")
    bw.newLine()
    bw.write("]")
    bw.newLine()
    bw.write("},")
    bw.newLine()
    bw.write("\"cpus\":\""+cpu+"\",")
    bw.newLine()
    bw.write("\"mem\":\""+mem+"\",")
    bw.newLine()
    bw.write("\"uris\": [],")
    bw.newLine()
    bw.write("\"command\":\""+filePath+"/"+jobName+"/innerSh.sh > "+jobName+" 2>&1\"")
    bw.newLine()
    bw.write("}")
    bw.newLine()
    bw.close()   
  }
}