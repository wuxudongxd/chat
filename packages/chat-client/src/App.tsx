import Auth from "~/views/auth";
import useUser from "./hooks/api/useUser";
import Main from "~/views/main";
import { ChatStoreProvider } from "./context/chat-store";

function App() {
  const {
    userQuery: { isFetching, data, isSuccess },
  } = useUser();

  return (
    <div>
      {!isFetching && !data && <Auth />}
      {isSuccess && data && (
        <ChatStoreProvider>
          <Main />
        </ChatStoreProvider>
      )}
    </div>
  );
}

export default App;
