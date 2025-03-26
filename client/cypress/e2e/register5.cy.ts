import {useRequests} from "./utils/request.ts";


describe("register api avec intercep",() => {
  it("l`erreur du server doit apparaitre",() => {
    useRequests().interceptUserAccountCreation(500, "Internal Server Error")
  })
  it("cas de not found",() => {
    useRequests().interceptUserAccountCreation(404, "Not Found");
  })
  it("user deja existant",() => {
    useRequests().interceptUserAccountCreation(409, "Conflict");
  })
})
