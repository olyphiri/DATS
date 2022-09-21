import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");

(async () => {
  try {
    const allRoles = await token.roles.getAll();

    console.log("Roles That Exist Right Now:", allRoles);

    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "Roles After Revoking Ourselves",
      await token.roles.getAll()
    );
    console.log("Successfully Revoked Our Superpowers From The DGVT Contract");

  } catch (error) {
    console.error("Failed To Revoke Ourselves From DGVT Contract", error);
  }
})();
