import { AppError } from "./../../../../shared/errors/AppError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
describe("GetBalenceUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("[GetBalenceUseCase] should be able to get an users balance", async () => {
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

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response).toStrictEqual({
      statement: [statement],
      balance: 100,
    });
  });

  it("[GetBalenceUseCase] should not be able to get a non-existent users balance", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
