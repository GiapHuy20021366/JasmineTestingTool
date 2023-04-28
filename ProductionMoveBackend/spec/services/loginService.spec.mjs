// require("../helpers/spec-helper");

import authenticationServices from "../../src/services/authenticationServices.js";
import bcryptServices from "../../src/services/bcryptServices.js";
import partnerServices from "../../src/services/partnerServices.js";
import db from "../../src/models/index.js";
// Custom matchers
import customMatcher from "../helpers/test-helpers.js";

describe("Test Login Service", () => {
  let spyFindOne;
  let spyCompare;
  let spyGenToken;
  beforeAll(() => {
    jasmine.addMatchers(customMatcher);
  });
  beforeEach(() => {
    spyFindOne = spyOn(db.Partners, "findOne");
    spyCompare = spyOn(bcryptServices, "compare");
    spyGenToken = spyOn(authenticationServices, "generateToken");
  });

  it("should reject message username doesn't exist", async () => {
    const fakeFindOne = spyFindOne.and.returnValue(Promise.resolve(null));
    const fakeCompare = spyCompare.and.callThrough();
    const fakeToken = spyGenToken.and.callThrough();

    await partnerServices
      .loginPartner({
        userName: "root",
        password: "password",
      })
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Username doesn't exist");
        expect(fakeFindOne).toHaveBeenCalledTimes(1);
        expect(fakeFindOne).toHaveBeenCalledWith({
          where: { userName: "root" },
        });
        expect(fakeCompare).not.toHaveBeenCalled();
        expect(fakeToken).not.toHaveBeenCalled();
      });
  });

  it("should reject message password incorrect", async () => {
    const fakeFindOne = spyFindOne.and.returnValue(
      Promise.resolve({
        userName: "root",
        password: "never-true",
      })
    );
    const fakeCompare = spyCompare.and.returnValue(
      Promise.reject({ code: -2 })
    );
    const fakeToken = spyGenToken.and.callThrough();

    await partnerServices
      .loginPartner({
        userName: "root",
        password: "password",
      })
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Password incorrect!");
        expect(fakeFindOne).toHaveBeenCalledTimes(1);
        expect(fakeFindOne).toHaveBeenCalledWith({
          where: { userName: "root" },
        });
        expect(fakeCompare).toHaveBeenCalledTimes(1);
        expect(fakeCompare).toHaveBeenCalledWith("password", "never-true");
        expect(fakeToken).not.toHaveBeenCalled();
      });
  });

  it("should resolve message login successful", async () => {
    const fakeFindOne = spyFindOne.and.returnValue(
      Promise.resolve({
        userName: "root",
        password: "always-true",
        role: "user",
        status: 1,
        id: 1234567,
      })
    );
    const fakeCompare = spyCompare.and.returnValue(Promise.resolve());
    const fakeToken = spyGenToken.and.returnValue("jwtTokenFaker");

    await partnerServices
      .loginPartner({
        userName: "root",
        password: "always-true",
      })
      .then((result) => {
        expect(result.message).toBe("Login successful!");
        expect(result.data).toHaveProperties({
          token: "jwtTokenFaker",
          id: 1234567,
          userName: "root",
          role: "user",
        });
        expect(fakeFindOne).toHaveBeenCalledTimes(1);
        expect(fakeFindOne).toHaveBeenCalledWith({
          where: { userName: "root" },
        });
        expect(fakeCompare).toHaveBeenCalledTimes(1);
        expect(fakeCompare).toHaveBeenCalledWith("always-true", "always-true");
        expect(fakeToken).toHaveBeenCalledTimes(1);
        expect(fakeToken).toHaveBeenCalledWith({
          userName: "root",
          status: 1,
          role: "user",
          id: 1234567,
        });
      })
      .catch((err) => {
        fail("Should resolve value but reject found");
      });
  });

  it("should reject message database error", async () => {
    const fakeFindOne = spyFindOne.and.returnValue(
      Promise.reject({ message: "DB error" })
    );
    const fakeCompare = spyCompare.and.stub();
    const fakeToken = spyGenToken.and.stub();

    await partnerServices
      .loginPartner({
        userName: "root",
        password: "always-true",
      })
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Database Error!");
        expect(fakeFindOne).toHaveBeenCalledTimes(1);
        expect(fakeFindOne).toHaveBeenCalledWith({
          where: { userName: "root" },
        });
        expect(fakeCompare).not.toHaveBeenCalled();
        expect(fakeToken).not.toHaveBeenCalled();
      });
  });

  it("should reject message internal server error", async () => {
    const fakeFindOne = spyFindOne.and.returnValue(
      Promise.resolve({
        userName: "root",
        password: "always-true",
        role: "user",
        status: 1,
        id: 1234567,
      })
    );
    const fakeCompare = spyCompare.and.returnValue(
      Promise.reject({ code: -5 })
    );
    const fakeToken = spyGenToken.and.stub();

    await partnerServices
      .loginPartner({
        userName: "root",
        password: "always-true",
      })
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Internal Server Error!");
        expect(fakeFindOne).toHaveBeenCalledTimes(1);
        expect(fakeFindOne).toHaveBeenCalledWith({
          where: { userName: "root" },
        });
        expect(fakeCompare).toHaveBeenCalledTimes(1);
        expect(fakeToken).not.toHaveBeenCalled();
      });
  });
});
