const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};

describe("Authentication", () => {
  test('User is able to sign up only once', async () => {
      const username = "farooq" + Math.random() + "@gmail.com"; // kirat0.12331313
      const password = "12345678";
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin"
      })

      expect(response.status).toBe(200)
      const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin"
      })

      expect(updatedResponse.status).toBe(400);
  });

  test('Signup request fails if the username is empty', async () => {
      const username = `farooq-${Math.random()}@gmail.com` // kirat-0.12312313
      const password = "12345678"

      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          password
      })

      expect(response.status).toBe(400)
  })

  test('Signin succeeds if the username and password are correct', async() => {
      const username = `farooq-${Math.random()}@gmail.com`
      const password = "12345678"

      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin"
      });

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username,
          password
      });

      expect(response.status).toBe(200)
      expect(response.data.token).toBeDefined()
      
  })

  test('Signin fails if the username and password are incorrect', async() => {
      const username = `farooq-${Math.random()}@gmail.com`
      const password = "12345678"

      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin"
      });

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username: "WrongUsername",
          password
      })

      expect(response.status).toBe(403)
  })
})


/*
describe("user metadata endpoint", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `farooq-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.body.token;

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    });

    avatarId = avatarResponse.data.avatarId;
  });

  test("User can't update their metadata with a wrong avatar Id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123123123",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with a correct avatar Id ", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  test("User is not able to update their metadta if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("User avatar information", () => {
  let token;
  let avatarId;
  let userId;

  beforeAll(async () => {
    const username = `farooq-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.body.token;

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    });

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBeDefined();
    // expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars list the recently create avater", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id === avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let token;
  let userId;
  let userToken;
  let adminId;
  let adminToken;

  beforeAll(async () => {
    const username = `farooq-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.body.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );
    userToken = userSigninResponse.body.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        Width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        Width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.id;
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space that doesn't exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoestntExsit`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is able to delete a space that exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoestntExsit`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(deleteResponse.statusCode).toBe(200);
  });

  test("User should not able to delete a space created by another user", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteResponse.statusCode).toBe(400);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has no spaces initially", async () => {
    const spaceCreateResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/all`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateResponse.spaceId
    );
    expect(spaceCreateResponse.data.spaces.length).toBe(0);
    expect(filteredSpace).toBeDefined();
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let token;
  let userId;
  let userToken;
  let adminId;
  let adminToken;
  let spaceId;

  beforeAll(async () => {
    const username = `farooq-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.body.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );
    userToken = userSigninResponse.body.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        Width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        Width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = map.id;

    const space = await axios.post(
      `${BACKEND_URL}/api/v1/`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = space.spaceId;
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kds01`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.statusCode).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const elementsRespone = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    await axios.delete(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        spaceId: spaceId,
        elementId: elementsRespone.data.elements[0].id,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newRespone = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newRespone.data.elements.length).toBe(2);
  });

  test("Adding an element wroks as expected", async () => {
    await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newRespone = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newRespone.data.elements.length).toBe(3);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const newResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 10000,
        y: 200000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.statusCode).toBe(400);
  });
});

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
      const username = `farooq-${Math.random()}`
      const password = "123456"

      const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
       username,
       password,
       type: "admin"
      });

      adminId = signupResponse.data.userId

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
       username: username,
       password
      })

      adminToken = response.data.token

      const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username: username + "-user",
          password,
          type: "user"
      });
 
      userId = userSignupResponse.data.userId
  
      const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username: username  + "-user",
          password
      })
  
      userToken = userSigninResponse.data.token
  });

  test("User is not able to hit admin Endpoints", async () => {
      const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          "width": 1,
          "height": 1,
        "static": true
      }, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      });

      const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
          "thumbnail": "https://thumbnail.com/a.png",
          "dimensions": "100x200",
          "name": "test space",
          "defaultElements": []
       }, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      })

      const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
          "name": "Timmy"
      }, {
          headers: {
              "authorization": `Bearer ${userToken}`
          }
      })

      const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      }, {
          headers: {
              "authorization": `Bearer ${userToken}`
          }
      })

      expect(elementReponse.status).toBe(403)
      expect(mapResponse.status).toBe(403)
      expect(avatarResponse.status).toBe(403)
      expect(updateElementResponse.status).toBe(403)
  })

  test("Admin is able to hit admin Endpoints", async () => {
      const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          "width": 1,
          "height": 1,
        "static": true
      }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });

      const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
          "thumbnail": "https://thumbnail.com/a.png",
          "name": "Space",
          "dimensions": "100x200",
          "defaultElements": []
       }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      })

      const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
          "name": "Timmy"
      }, {
          headers: {
              "authorization": `Bearer ${adminToken}`
          }
      })
      expect(elementReponse.status).toBe(200)
      expect(mapResponse.status).toBe(200)
      expect(avatarResponse.status).toBe(200)
  })

  test("Admin is able to update the imageUrl for an element", async () => {
      const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          "width": 1,
          "height": 1,
        "static": true
      }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });

      const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      }, {
          headers: {
              "authorization": `Bearer ${adminToken}`
          }
      })

      expect(updateElementResponse.status).toBe(200);
  })
}); */

// start form 2:16
