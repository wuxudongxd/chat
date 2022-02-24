import Auth from "~/views/auth";
import useUser from "./hooks/api/useUser";
import Main from "~/views/main";

function App() {
  const {
    userQuery: { isFetching, data, isSuccess },
  } = useUser();

  return (
    <div>
      {!isFetching && !data && <Auth />}
      {isSuccess && data && <Main />}
    </div>
  );
}

export default App;
