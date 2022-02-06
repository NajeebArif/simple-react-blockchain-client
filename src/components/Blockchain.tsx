import React, { useEffect, useState } from "react";
import { BlockchainNode } from "../lib/blockchain-node";
import BlocksPanel from "./BlocksPanel";

type Props = {
  node: BlockchainNode;
};

const Blockchain: React.FC<Props> = ({ node }) => {
  return (
    <div className="container m-2 p-2">
      <BlocksPanel
        blocks={node.chain}
        customCss="flex flex-wrap m-4 p-4 gap-3 shadow-2xl overflow-scroll"
      />
    </div>
  );
};

export default Blockchain;
