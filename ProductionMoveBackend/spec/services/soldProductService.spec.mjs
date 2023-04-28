import purchaseServices from "../../src/services/purchaseServices.js";
import mailServices from "../../src/services/mailServices.js";
import authenticationServices from "../../src/services/authenticationServices.js";
import db from "../../src/models/index.js";

// Custom matchers
import customMatcher from "../helpers/test-helpers.js";

describe("Test Purchase Service", () => {
  beforeAll(() => {
    jasmine.addMatchers(customMatcher);
  });

  it("Should reject message authentication failed because of invalid token", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(Promise.reject({ name: "token invalid" }));
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.stub();
    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({}, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Authentication failed: token invalid");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyProductHoldersFindOne).not.toHaveBeenCalled();
        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message account not active", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            status: 1,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.stub();
    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({}, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Account not active. Please active your account"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyProductHoldersFindOne).not.toHaveBeenCalled();
        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message account is cancel", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            status: 0,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.stub();
    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Account is cancel");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyProductHoldersFindOne).not.toHaveBeenCalled();
        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message not permission", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            status: 2,
            role: 1,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.stub();
    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe("Authentication failed: Not Permision");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");
        expect(spyProductHoldersFindOne).not.toHaveBeenCalled();
        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by ProductHolders.findOne", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(Promise.reject("error cause by ProductHolders.findOne"));

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error cause by ProductHolders.findOne"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message no permission to sold product because it no longer at this agency or sold", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: 123,
        partner1Id: 100,
        partner2Id: 101,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.stub();
    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "No permission to sold product: This product is no longer at this agency or sold"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by Products.findByPk", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.reject("error cause by Products.findByPk")
    );

    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error cause by Products.findByPk"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message no permission to sold product because it no longer existed before", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve(null)
    );

    const spyCustomersFindByPk = spyOn(db.Customers, "findByPk").and.stub();
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123 }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "No permission to sold product: This product is no longer existed before"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();
        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by Customers.findByPk", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.reject("error caused by Customers.findByPk"));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { id: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error caused by Customers.findByPk"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindByPk).toHaveBeenCalledWith(666);

        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message no customer with id found", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.stub();
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { id: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(`No customer with id ${666} found`);
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindByPk).toHaveBeenCalledWith(666);

        expect(spyCustomersFindOne).not.toHaveBeenCalled();
        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by Customers.findOne", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.returnValue(
      Promise.reject("error caused by Customers.findOne")
    );
    const spyCustomersCreate = spyOn(db.Customers, "create").and.stub();
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { cardId: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error caused by Customers.findOne"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();

        expect(spyCustomersFindOne).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindOne).toHaveBeenCalledWith({
          where: {
            cardId: 666,
          },
        });

        expect(spyCustomersCreate).not.toHaveBeenCalled();
        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by Customers.create", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.returnValue(
      Promise.resolve(null)
    );
    const spyCustomersCreate = spyOn(db.Customers, "create").and.returnValue(
      Promise.reject("error caused by Customers.create")
    );
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.stub();
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { cardId: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error caused by Customers.create"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();

        expect(spyCustomersFindOne).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindOne).toHaveBeenCalledWith({
          where: {
            cardId: 666,
          },
        });

        expect(spyCustomersCreate).toHaveBeenCalledTimes(1);
        expect(spyCustomersCreate).toHaveBeenCalledWith({ cardId: 666 });

        expect(spyPurchasesCreate).not.toHaveBeenCalled();
        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by Purchases.create", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.returnValue(
      Promise.resolve(null)
    );
    const spyCustomersCreate = spyOn(db.Customers, "create").and.returnValue(
      Promise.resolve({ id: 1000 })
    );
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.returnValue(
      Promise.reject("error caused by Purchases.create")
    );
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { cardId: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error caused by Purchases.create"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();

        expect(spyCustomersFindOne).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindOne).toHaveBeenCalledWith({
          where: {
            cardId: 666,
          },
        });

        expect(spyCustomersCreate).toHaveBeenCalledTimes(1);
        expect(spyCustomersCreate).toHaveBeenCalledWith({ cardId: 666 });

        expect(spyPurchasesCreate).toHaveBeenCalledTimes(1);
        expect(spyPurchasesCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({
            customerId: 1000,
            productId: 123,
            partnerId: 9999,
          })
        );

        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should reject message database error caused by ProductHolders.save", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
        save: () => Promise.reject("error caused by ProductHolders.save"),
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.returnValue(
      Promise.resolve(null)
    );
    const spyCustomersCreate = spyOn(db.Customers, "create").and.returnValue(
      Promise.resolve({ id: 1000 })
    );
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.returnValue(
      Promise.resolve({})
    );
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { cardId: 666 } }, "token")
      .then(() => {
        fail("Should reject value but resolve found");
      })
      .catch((err) => {
        expect(err.message).toBe(
          "Database Error! error caused by ProductHolders.save"
        );
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();

        expect(spyCustomersFindOne).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindOne).toHaveBeenCalledWith({
          where: {
            cardId: 666,
          },
        });

        expect(spyCustomersCreate).toHaveBeenCalledTimes(1);
        expect(spyCustomersCreate).toHaveBeenCalledWith({ cardId: 666 });

        expect(spyPurchasesCreate).toHaveBeenCalledTimes(1);
        expect(spyPurchasesCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({
            customerId: 1000,
            productId: 123,
            partnerId: 9999,
          })
        );

        expect(spySendMail).not.toHaveBeenCalled();
      });
  });

  it("Should resolve message sold product successful", async () => {
    const spyVerifyToken = spyOn(
      authenticationServices,
      "verifyToken"
    ).and.returnValue(
      Promise.resolve({
        data: {
          data: {
            id: 9999,
            status: 2,
            role: 3,
          },
        },
      })
    );
    const spyProductHoldersFindOne = spyOn(
      db.ProductHolders,
      "findOne"
    ).and.returnValue(
      Promise.resolve({
        customerId: -1,
        partner1Id: 9999,
        partner2Id: -1,
        save: () => Promise.resolve(),
      })
    );

    const spyProductsFindByPk = spyOn(db.Products, "findByPk").and.returnValue(
      Promise.resolve({ id: 100000 })
    );

    const spyCustomersFindByPk = spyOn(
      db.Customers,
      "findByPk"
    ).and.returnValue(Promise.resolve(null));
    const spyCustomersFindOne = spyOn(db.Customers, "findOne").and.returnValue(
      Promise.resolve(null)
    );
    const spyCustomersCreate = spyOn(db.Customers, "create").and.returnValue(
      Promise.resolve({ id: 1000 })
    );
    const spyPurchasesCreate = spyOn(db.Purchases, "create").and.returnValue(
      Promise.resolve({})
    );
    const spySendMail = spyOn(mailServices, "sendSimpleEmail").and.stub();

    await purchaseServices
      .soldProduct({ productId: 123, customer: { cardId: 666 } }, "token")
      .then((result) => {
        expect(result.message).toBe("Sold product successful");
        expect(spyVerifyToken).toHaveBeenCalledTimes(1);
        expect(spyVerifyToken).toHaveBeenCalledWith("token");

        expect(spyProductHoldersFindOne).toHaveBeenCalledTimes(1);
        expect(spyProductHoldersFindOne).toHaveBeenCalledWith({
          where: {
            productId: 123,
          },
        });

        expect(spyProductsFindByPk).toHaveBeenCalledTimes(1);
        expect(spyProductsFindByPk).toHaveBeenCalledWith(123);

        expect(spyCustomersFindByPk).not.toHaveBeenCalled();

        expect(spyCustomersFindOne).toHaveBeenCalledTimes(1);
        expect(spyCustomersFindOne).toHaveBeenCalledWith({
          where: {
            cardId: 666,
          },
        });

        expect(spyCustomersCreate).toHaveBeenCalledTimes(1);
        expect(spyCustomersCreate).toHaveBeenCalledWith({ cardId: 666 });

        expect(spyPurchasesCreate).toHaveBeenCalledTimes(1);
        expect(spyPurchasesCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({
            customerId: 1000,
            productId: 123,
            partnerId: 9999,
          })
        );

        expect(spySendMail).toHaveBeenCalledTimes(1);
      })
      .catch((err) => {
        fail("Should resolve value but reject found");
      });
  });
});
