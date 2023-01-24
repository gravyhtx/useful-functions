
function eachNode(rootNode: Node, callback: (node: Node) => void | boolean) {
  if (!callback) {
    const nodes = [];
    eachNode(rootNode, (node: Node) => {
      nodes.push(node);
    })
    return nodes;
  }

  if (callback(rootNode) === false) {
    return false;
  }

  if (rootNode.hasChildNodes()) {
    for (const node of rootNode.childNodes) {
      if (eachNode(node, callback) === false) {
        return;
      }
    }
  }
}


export function findTextNodes(parentNode: Node, pattern: RegExp) {
  let matches: Node | Node[] = [];
  let endScan = false;

  eachNode(parentNode, (node: Node) => {
    if (endScan) {
      return false;
    }

    // Ignore anything which isn't a text node
    if (node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    if (pattern.test(node.textContent)) {
      if (!pattern.global) {
        endScan = true;
        matches = node;
      } else {
        if (Array.isArray(matches)) {
          matches.push(node);
        } else {
          matches = [matches, node];
        }
      }
    }
  })

  return matches;
}