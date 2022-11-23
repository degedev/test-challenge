import { AppError } from "./../../../../shared/errors/AppError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("[ShowUserProfileUseCase] should be able to show a user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Sample Name",
      email: "sample@email.com",
      password: "sample_password",
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toHaveProperty("id");
  });

  it("[ShowUserProfileUseCase] should be able to show a profile of a non existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non_valid_id");
    }).rejects.toBeInstanceOf(AppError);
  });
});
