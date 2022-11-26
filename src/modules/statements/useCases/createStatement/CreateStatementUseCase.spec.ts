import { AppError } from "./../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("[CreateStatementUseCase] should be able to create a new deposit statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Sample Name",
      email: "sample@email.com",
      password: "sample_password",
    });

    const response = await createStatementUseCase.execute({
      amount: 100,
      description: "deposit statement description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("[CreateStatementUseCase] should be able to create a new withdraw statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Sample Name",
      email: "sample@email.com",
      password: "sample_password",
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: "deposit statement description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await createStatementUseCase.execute({
      amount: 50,
      description: "withdraw statement description",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("[CreateStatementUseCase] should not be able to create a new withdraw statement with insufficient funds", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Sample Name",
        email: "sample@email.com",
        password: "sample_password",
      });

      await createStatementUseCase.execute({
        amount: 50,
        description: "withdraw statement description",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[CreateStatementUseCase] should not be able to create a new statement if user does not exists", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 50,
        description: "withdraw statement description",
        type: OperationType.WITHDRAW,
        user_id: "invalid_id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
