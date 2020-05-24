import { fetchValue } from "./utils/fetchValue";

const main = async () => {
  try {
    const value = await fetchValue("graphql-backend:staging:jwt-secret");
    console.log(value);
  } catch (e) {
    console.log(e);
  }
  // const configs = await loadConfigs();
  // console.log(configs);
};

main();
