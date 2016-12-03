package controllers

import play.api._
import play.api.mvc._
import akka.actor._
import akka.stream.Materializer
import play.api.libs.streams._
import javax.inject._


class PageController @Inject() (implicit system: ActorSystem, materializer: Materializer) extends Controller{
  
    def loginPage = Action { implicit request =>
      Ok(views.html.login())
    }
    
    def main = Action { implicit request =>
      request.session.get("uId") match{
        case Some(v) => Ok(views.html.main(v)) 
        case None   => Ok(views.html.login())
      }
    }

   
   def getHtml(data: String) = Action {
    implicit request =>
      val text = "views.html." + data
      Logger.debug(text)
      if (data == "pipeline")
        Ok(views.html.pipeline())
      else if (data == "message")
         Ok(views.html.message())
      else if(data=="jobCreate")
        Ok(views.html.jobCreate())
      else if(data=="jobList")
        Ok(views.html.jobList())
      else if(data=="uploadPage")
        Ok(views.html.uploadPage())          
      else if(data=="bundleUpload")
        Ok(views.html.bundleUpload())
      else if(data=="bundleList")
        Ok(views.html.bundleList())
      else if(data=="exeUpload")
        Ok(views.html.exeUpload())
      else if(data=="exeList")
        Ok(views.html.exeList())
      else if(data=="uploadWindow")
        Ok(views.html.uploadWindow())
      else
        Ok(views.html.directory())
  }
   def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef(out => WebSocketActor.props(out))
  }
}