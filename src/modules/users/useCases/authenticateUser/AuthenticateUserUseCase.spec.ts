import { AppError } from "./../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { hash } from "bcryptjs";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("[AuthenticateUserUseCase] should be able to authenticate an user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Sample Name",
      email: "sample@email.com",
      password: await hash("sample_password", 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: "sample_password",
    });

    expect(response).toHaveProperty("token");
  });

  it("[AuthenticateUserUseCase] should not be able to authenticate a non-existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non_existent@email.com",
        password: "non_existent_password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[AuthenticateUserUseCase] should not be able to authenticate an user with wrong email", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Sample Name",
        email: "sample@email.com",
        password: await hash("sample_password", 8),
      });

      await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: "sample_password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[AuthenticateUserUseCase] should not be able to authenticate an user with wrong password", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Sample Name",
        email: "sample@email.com",
        password: await hash("sample_password", 8),
      });

      await authenticateUserUseCase.execute({
        email: "sample@email.com",
        password: "wrong_password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
