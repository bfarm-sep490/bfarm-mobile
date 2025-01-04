# BFarm Mobile Application

## Directory Structure
```plaintext
src/
├── @types          # Custom TypeScript definitions
├── app             # App entry and routing
├── assets          # Static assets like images and fonts
├── components      # Reusable UI components
├── constants       # Static constants and enums
├── context         # React context for global state
├── hooks           # Custom React hooks
├── screens         # App screens grouped by features
│   ├── auth        # Authentication-related screens
│   ├── home        # Main app screens
│   ├── news-feed   # News feed screens
│   └── todo        # Example or todo-related screens
├── services        # API services and external integrations
│   ├── api         # Axios instance and API methods
│   └── translations # Localization files
├── store           # Redux store and slices
```

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>=16.x)
- Yarn (>=1.22.x)
- Expo CLI
- Android Studio or Xcode for native builds

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/bfarm-sep490/bfarm-mobile.git
   cd bfarm-mobile
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Configure environment variables:
   Create a `.env` file at the root and define your variables.

4. Start the development server:
   ```bash
   yarn start
   ```

## API Query Usage
This project uses `@tanstack/react-query` for efficient data fetching and state management. Below is an example of how API calls are structured:

### Example: Fetching User Data
```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { UserServices } from './userService';

import type { User } from './schema';

const enum UserQueryKey {
  fetchOne = 'fetchOneUser',
}

const useFetchOneQuery = (currentId: User['id']) =>
  useQuery({
    enabled: currentId >= 0,
    queryFn: () => UserServices.fetchOne(currentId),
    queryKey: [UserQueryKey.fetchOne, currentId],
  });

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: UserQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  return {
    invalidateQuery,
    useFetchOneQuery,
  };
};
```
This approach modularizes API calls, supports query invalidation, and integrates seamlessly with React Query for caching and reactivity.

## Scripts
Here are some useful scripts defined in the `package.json`:

| Command                          | Description                               |
|----------------------------------|-------------------------------------------|
| `yarn start`                     | Start the Expo development server        |
| `yarn android`                   | Run the app on an Android device/emulator|
| `yarn ios`                       | Run the app on an iOS simulator          |
| `yarn web`                       | Run the app in a web browser             |
| `yarn lint`                      | Run ESLint to lint code                  |
| `yarn typecheck`                 | Type-check the project using TypeScript  |
| `yarn test`                      | Run unit tests using Jest                |
| `yarn prebuild`                  | Prepare the project for native builds    |
| `yarn android:release`           | Build a release version for Android      |
| `yarn ios:release`               | Build a release version for iOS          |

## Technologies Used
### Core
- **React Native**: Core framework
- **Expo**: Build and development platform
- **TypeScript**: Type safety and modern JavaScript features

### UI
- **Gluestack UI**: Modular component library
- **Tailwind CSS**: Utility-first CSS framework
- **nativewind**: Tailwind CSS for React Native

### State Management
- **Redux Toolkit**: State management
- **React Query**: Server-state management

### API & Networking
- **Axios**: HTTP client
- **React Hook Form**: Form handling

### Localization
- **i18next**: Internationalization framework

### Testing
- **Jest**: Unit testing
- **Detox**: End-to-end testing

## Environment Variables
The application relies on a `.env` file for sensitive configurations. Below are the required variables:
- `API_BASE_URL`: Base URL for the backend API
- `NODE_ENV`: Development or production mode

## 🤝 Contributing

### Local Development Flow
1. Create a new branch for your feature
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. Make your changes and commit frequently
   ```bash
   git commit -m 'feat: add new feature component'
   git commit -m 'feat: implement feature logic'
   git commit -m 'test: add tests for new feature'
   ```

3. Keep your branch up to date by rebasing with main
   ```bash
   # Update your local main
   git checkout main
   git pull origin main

   # Rebase your feature branch
   git checkout feature/amazing-feature
   git rebase main

   # If there are conflicts, resolve them and continue
   git rebase --continue
   ```

4. Push your branch to GitHub
   ```bash
   git push origin feature/amazing-feature
   ```

   If you've rebased your branch and get a push rejection, use force-push:
   ```bash
   git push --force-with-lease origin feature/amazing-feature
   ```
   
   > ⚠️ **Note**: Use `--force-with-lease` instead of `--force` as it's safer. It will prevent you from overwriting others' work if someone else has pushed to your branch.

### Pull Request Process
1. Create a Pull Request on GitHub
2. Ensure the PR title follows the commit convention
3. Request reviews from team members
4. Address any review comments with new commits
5. Once approved, the PR will be automatically squashed and merged
   - All commits will be combined into one
   - The PR title will be used as the final commit message
   - The commit details will include a co-authored-by credit

### GitHub Repository Settings
- Branch Protection Rules:
  - Require pull request reviews before merging
  - Require branches to be up to date
  - Squash merging enabled by default
  - Commit messages will be automatically formatted based on PR title

## 📝 Commit Convention

This project uses conventional commits specification with custom types. Your commit message should have one of the following types:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Adding or modifying tests
- `build:` - Changes to build system or dependencies
- `ci:` - Changes to CI configuration files and scripts
- `chore:` - Other changes that don't modify src or test files
- `revert:` - Reverts a previous commit
- `add:` - Adding new resources or files
- `foo:` - Custom type for specific project needs

Example commit messages:
```bash
feat: add user authentication system
fix: resolve login page redirect issue
add: implement new dashboard widgets
```

## 📄 License
[MIT License](LICENSE).

## Acknowledgments
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gluestack UI](https://gluestack.io/)
