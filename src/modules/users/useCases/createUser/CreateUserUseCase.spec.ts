import { AppError } from "./../../../../shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("[CreateUserUseCase] should be able to create a new user", async () => {
    const response = await createUserUseCase.execute({
      name: "Sample Name",
      email: "sample@email.com",
      password: "sample_password",
    });

    expect(response).toHaveProperty("id");
  });

  it("[CreateUserUseCase] should not be able to create a new user if email already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Sample Name 1",
        email: "samesample@email.com",
        password: "sample_password1",
      });

      await createUserUseCase.execute({
        name: "Sample Name 2",
        email: "samesample@email.com",
        password: "sample_password2",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
