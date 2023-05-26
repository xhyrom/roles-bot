<h1 align="center">
  <br>
  <img src="https://github.com/xHyroM/website/blob/main/src/assets/logo.png?raw=true" alt="Hyro" width="256">
  <br>
</h1>

<h4 align="center">Source code for Roles Bot, a discord bot.</h4>

<p align="center">
    <a href="https://s.xhyrom.dev/discord" alt="Discord">
        <img src="https://img.shields.io/discord/1046534628577640528?label=discord&style=for-the-badge&color=2fbfc4"/>
    </a>
</p>

## Informations

Discord bot for reaction roles that works with [Cloudflare Workers](https://workers.cloudflare.com/).

You can add the bot to your server, just click [here](https://discord.com/api/oauth2/authorize?client_id=923267906941370368&permissions=268435456&scope=bot%20applications.commands).

## Setup

1. Clone this repository: `git clone https://github.com/xHyroM/roles-bot.git`
2. Navigate to the project directory: `cd roles-bot`
3. Install the dependencies: `pnpm install`

## Usage

- To run the development server: `pnpm run dev`
- To build the project for production: `pnpm run build`
- To preview the production build of website: `pnpm run preview`
- To deploy bot to CF workers: `pnpm run deploy`

## Contributing

To contribute to this project, please follow the [standard Git workflow](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository#The-Standard-Git-Workflow) and [CONTRIBUTING](./CONTRIBUTING.md).

1. Fork this repository
2. Create a new branch for your changes: `git checkout -b my-feature`
3. Commit your changes: `git commit -am "Add my feature"`
4. Push the branch: `git push origin my-feature`
5. Open a pull request

## License

This project is licensed under the [MIT License](./LICENSE).
