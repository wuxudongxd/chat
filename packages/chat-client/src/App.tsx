import Auth from "~/views/auth";
import useUser from "./hooks/api/useUser";

function App() {
  const { userQuery } = useUser();

  console.log(userQuery);

  return <Auth />;
}

export default App;
