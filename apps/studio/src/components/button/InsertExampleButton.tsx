import Tooltip from "~/components/Tooltip/Tooltip";
import { Button } from "~/components/ui/button";
import { ExampleIcon } from "~/icons/Example";
import {
  AFTER_SNIPPET_DEFAULT_CODE,
  BEFORE_SNIPPET_DEFAULT_CODE,
  buildDefaultCodemodSource,
} from "~/store/getInitialState";
import { useModStore } from "~/store/zustand/mod";
import { useSnippetStore } from "~/store/zustand/snippets";

const InsertExampleButton = () => {
  const { engine, setInput, setOutput } = useSnippetStore();
  const { setContent } = useModStore();
  return (
    <Tooltip
      trigger={
        <Button
          className="flex items-center justify-center px-0"
          onClick={() => {
            setInput(BEFORE_SNIPPET_DEFAULT_CODE);
            setOutput(AFTER_SNIPPET_DEFAULT_CODE);
            setContent(buildDefaultCodemodSource(engine));
          }}
          size="xs"
          variant="ghost"
        >
          {/* <KeyboardIcon className="h-4 w-4" /> */}
          <ExampleIcon />
          <span className="sr-only">Insert Example</span>
        </Button>
      }
      content={<p className="font-normal">Insert an example</p>}
    />
  );
};

export default InsertExampleButton;
