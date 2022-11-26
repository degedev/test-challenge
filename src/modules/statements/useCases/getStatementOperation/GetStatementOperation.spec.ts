import { AppError } from "./../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("[GetStatementOperationUseCase] should be able to get a statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Sample Name",
      email: "sample@email.com",
      password: "sample_password",
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "deposit statement description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id");
  });

  it("[GetStatementOperationUseCase] should not be able to get a statement operation of a non-existent user", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Sample Name",
        email: "sample@email.com",
        password: "sample_password",
      });

      const statement = await inMemoryStatementsRepository.create({
        amount: 100,
        description: "deposit statement description",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await getStatementOperationUseCase.execute({
        user_id: "invalid_id",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("[GetStatementOperationUseCase] should not be able to get a statement operation of a non-existent operation", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Sample Name",
        email: "sample@email.com",
        password: "sample_password",
      });

      await inMemoryStatementsRepository.create({
        amount: 100,
        description: "deposit statement description",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "invalid_id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
