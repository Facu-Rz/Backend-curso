const [, , method, route, ...args] = process.argv;

if(!method || !route){
    throw new Error("Method and route are required. Please provide both.");
}

const [resource, id] = route.split("/");

const BASE_URL = "https://fakestoreapi.com";

const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

const GETMethod = async (resource, id) => {
    const endpoint = id ? `${BASE_URL}/${resource}/${id}` : `${BASE_URL}/${resource}`;
    const data = await request(endpoint);
    console.log("Item:\n", data);
}

const POSTMethod = async (resource, title, price, category) => {
    if (!title || !price || !category) {
      throw new Error(
        `Title, price, and category are required for POST requests on ${resource}`,
      );
    }

    const optionsObj = {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ title, price: Number(price), category })
    };

    const data = await request(`${BASE_URL}/${resource}`, optionsObj);
    console.log("Created item:\n", data);
}

const DELETEMethod = async (resource, id) => {
    if (!id) {
      throw new Error(`ID is required for DELETE requests on ${resource}`);
    }

    const data = await request(`${BASE_URL}/${resource}/${id}`, { method: "DELETE" });
    console.log("Deleted item:\n", data);
}

try {
    switch (method) {
        case "GET":
            await GETMethod(resource, id);
            break;
        case "POST":
            await POSTMethod(resource, ...args);
            break;
        case "DELETE":
            await DELETEMethod(resource, id);
            break;
        default:
            throw new Error(`Unsupported method: ${method}`);
    }
} catch (error) {
    console.error("Error:", error.message);
}    