import Auth from "~/views/auth";
import useUser from "./hooks/api/useUser";
import Main from "~/views/main";
import { ChatStoreProvider } from "./context/chat-store";
import { SocketIoProvider } from "./context/socket-io";

function App() {
  const {
    userQuery: { isFetching, data, isSuccess },
  } = useUser();

  return (
    <div>
      {!isFetching && !data && <Auth />}
      {isSuccess && data && (
        <SocketIoProvider>
          <ChatStoreProvider>
            <Main />
          </ChatStoreProvider>
        </SocketIoProvider>
      )}
    </div>
  );
}

export default App;
