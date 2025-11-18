import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log("🟢 Cliente conectado al socket:", client.id);
  }

  handleDisconnect(client: Socket) {
    console.log("🔴 Cliente desconectado:", client.id);
  }

  notifyAdmins(payload: any) {
    console.log("🐞 notifyAdmins llamado");
    this.server.emit("admin-notification", payload);
    console.log("🐞 Evento emitido");
  }
}
