import { Component } from "preact";
import Guild from "./Guild";
import LoadingGuild from "./LoadingGuild";
import type { MutualeGuild } from "~/env";

interface State {
  guilds: MutualeGuild[] | null;
}

export default class GuildSelector extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      guilds: null,
    };
  }

  async componentDidMount() {
    const response = await fetch("/api/user/guilds");
    const data = await response.json();
    this.setState({ guilds: data });
  }

  render() {
    const { guilds } = this.state;
    if (!guilds) return [...Array(15)].map(() => <LoadingGuild />);

    return guilds.map((g) => <Guild guild={g.guild} mutual={g.mutual} />);
  }
}
