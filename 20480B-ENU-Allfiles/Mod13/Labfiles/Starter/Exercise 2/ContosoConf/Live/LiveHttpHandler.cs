using System.Threading.Tasks;
using System.Web;
using System.Web.WebSockets;

namespace ContosoConf.Live
{
    public class LiveHttpHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(ProcessWebSocketRequest);
            }
        }

        Task ProcessWebSocketRequest(AspNetWebSocketContext context)
        {
            var socket = context.WebSocket;
            var connection = new LiveClientConnection(socket);
            return connection.Start();
        }

        public bool IsReusable
        {
            get { return false; }
        }
    }
}