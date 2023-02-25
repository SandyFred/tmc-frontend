import { Route, Switch } from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";

export const config = {
  endpoint: "http://localhost:49160/v1",
};

function App() {
  return (
    <Switch>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
    </Switch>
  );
}

export default App;
