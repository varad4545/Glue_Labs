

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Blog App",
        description: "Blog Application Rest API Information",
        contact: {
          name: "Varad",
        },
        servers: [
          {
            api: "http://localhost:3000/",
          },
        ],
      },
    },
    apis: ["./routes/*.js"],
  };


module.exports=swaggerOptions