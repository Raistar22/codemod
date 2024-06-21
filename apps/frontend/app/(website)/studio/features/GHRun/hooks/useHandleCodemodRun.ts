import type { CodemodRunRequest } from "@shared/types";
import { useModStore } from "@studio/store/zustand/mod";
import { transpileTs } from "@studio/utils/transpileTs";
import type { GHBranch, GithubRepository } from "be-types";
import { useSnippetsStore } from "../../../src/store/zustand/snippets";

type Props = {
  onCodemodRun: (request: CodemodRunRequest) => Promise<void>;
  selectedRepository: GithubRepository | undefined;
  selectedBranch: GHBranch | undefined;
};
export const useHandleCodemodRun = ({
  onCodemodRun,
  selectedRepository,
  selectedBranch,
}: Props) => {
  const { engine } = useSnippetsStore();
  const { internalContent } = useModStore();
  const isCodemodSourceNotEmpty = internalContent?.trim() !== "";

  return async () => {
    if (
      selectedRepository === undefined ||
      selectedBranch === undefined ||
      internalContent === null ||
      !isCodemodSourceNotEmpty ||
      !(engine === "jscodeshift" || engine === "ts-morph") // other engines are not supported by backend API
    ) {
      return;
    }

    const request = {
      codemodEngine: engine,
      repoUrl: selectedRepository.html_url,
      codemodSource: await transpileTs(internalContent),
      branch: selectedBranch.name,
    };

    await onCodemodRun(request);
  };
};
