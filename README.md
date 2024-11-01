# Angular NBlocks Library

This Angular library simplifies integration with the NBlocks service ([https://www.nblocks.dev/](https://www.nblocks.dev/)).

## Installation

For basic usage, follow the in-app instructions after signing up and logging in to NBlocks.

The provided quickstart ([https://nebulr-group.github.io/nblocks-docs/docs/getting-started/quickstart](https://nebulr-group.github.io/nblocks-docs/docs/getting-started/quickstart)) offers a general guide, but won't include your specific app details such as appId.

## Development & Testing

**Example Project:**

This repository includes an example Angular project to help you test and understand the library.

**Running the Project:**

1. Build the library for watching changes: `npm run build:lib:watch` (separate terminal)
2. Start the example app: `npm run start:example` (separate terminal)


Note a docker file is also provided to run the example app in a container. 

**Library Functionality:**

* **NBlocksModule:** Entry point for your application.
* **ProtectedRouteGuard:** Restricts access to specific routes for logged-in users.
* **LoginComponent:** Handles login redirection to NBlocks.
* **CallbackComponent:** Manages NBlocks callback logic.
* **Automatic token refreshes and storage:** Built-in functionality.
* **Feature Flags Component:** Wrapper component for DOM elements.

Refer to the quickstart and example project for detailed usage examples.

## Compatibility

This library is tested and validated for Angular version 18.28.