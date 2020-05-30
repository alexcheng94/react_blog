import React from "react";
import { DiscussionEmbed } from "disqus-react";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

type Props = {
  identifier: string;
  title: string;
};

const DisqusComment: React.FC<Props> = ({ identifier, title }) => {
  const disqusShortname = "alexreactblog";
  const disqusConfig = {
    url: window.location.href,
    identifier,
    title
  };

  return (
    <div className="comments">
      <Divider style={{ margin: "40px 0" }} />
      <Typography variant="caption">
        Comments powered by Disqus (需梯子访问)
        <span role="img" aria-label="smiling emoji">
          😀
        </span>
      </Typography>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComment;
