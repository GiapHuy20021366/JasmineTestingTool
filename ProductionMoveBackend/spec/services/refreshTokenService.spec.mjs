import authenticationServices from "../../src/services/authenticationServices.js";
import partnerServices from "../../src/services/partnerServices.js";

// Custom matchers
import customMatcher from "../helpers/test-helpers.js";

describe("Test Refresh Token Service", () => {
  beforeAll(() => {
    jasmine.addMatchers(customMatcher);
  });

  it("should reject message authentication failed caused by token invalid", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(Promise.reject({ name: "invalid token" }));
    const spyGenToken = spyOn(
      authenticationServices,
      "generateToken"
    ).and.stub();

    await partnerServices
      .refreshToken("1234567")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Authentication failed: invalid token");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("1234567");
        expect(spyGenToken).not.toHaveBeenCalled();
      });
  });

  it("should resolve message token refresh successful", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({ data: { data: { id: 9999, role: 1 } } })
    );
    const spyGenToken = spyOn(
      authenticationServices,
      "generateToken"
    ).and.returnValue("refreshed-token");

    await partnerServices
      .refreshToken("1234567")
      .then((result) => {
        expect(result.message).toBe("Token refresh successful!");
        expect(result.data).toHaveProperties({
          token: "refreshed-token",
        });
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("1234567");
        expect(spyGenToken).toHaveBeenCalledTimes(1);
        expect(spyGenToken).toHaveBeenCalledWith({ id: 9999, role: 1 });
      })
      .catch((err) => {
        fail("Should resolve value but reject found");
      });
  });
});
