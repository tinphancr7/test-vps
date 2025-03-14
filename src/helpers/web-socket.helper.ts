import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";

function getToken(): string | null {
  return localStorage.getItem("accessToken") || "null";
}

const accessToken: string | null = getToken();
const URL = "http://localhost:5539";

class WebSocketHelper {
  public socket: Socket | undefined;

  private static instance: WebSocketHelper;

  constructor() {
    if (!WebSocketHelper.instance) {
      this.socket = io(URL, {
        transports: ["websocket"],
        autoConnect: false,
        auth: { token: accessToken },
        ...({ maxHttpBufferSize: 1e8 } as Partial<ManagerOptions & SocketOptions>),
      });

      WebSocketHelper.instance = this;
    }

    return WebSocketHelper.instance;
  }

  setAccessToken(token: string): void {
    if (this.socket) {
      this.socket.auth = { token };
    }
  }
}

const singletonWebsocket = new WebSocketHelper();
export const setAccessToken = singletonWebsocket.setAccessToken.bind(singletonWebsocket);
export default singletonWebsocket.socket;
