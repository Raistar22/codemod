import { KnownEngines } from "@codemod-com/utilities";
import { useAuth } from "@clerk/nextjs";
import { Backspace as BackspaceIcon } from "@phosphor-icons/react";
import { Link as LinkIcon } from "@phosphor-icons/react";
import { Check as CheckIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { pipe } from "ramda";
import { useEffect, useRef, useState } from "react";
import AuthButtons from "~/auth/AuthButtons";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { authUrl } from "~/config";
import { useModal } from "~/hooks/useModal";
import { CodemodLogo } from "~/icons/CodemodLogo";
import { cn } from "~/lib/utils";
import { useModStore } from "~/store/zustand/mod";
import { useSnippetStore } from "~/store/zustand/snippets";
import { useUserState } from "~/store/zustand/user";
import { DownloadZip } from "./DownloadZip";
import { useTheme } from "./themeContext";
import { usePublicLinkSharing } from "./usePublicLinkSharing";

const Header = () => {
	const { engine, setEngine, setInput, setOutput } = useSnippetStore();
	const { setContent } = useModStore();
	const { toggleTheme, isDark } = useTheme();

	const onEngineChange = (value: KnownEngines) => {
		if (value === "jscodeshift" || value === "ts-morph") {
			setEngine(value);
		}
	};

	const { getShareLink, isCreating: isShareURLBeingCreated } =
		usePublicLinkSharing();

	const router = useRouter();
	const { isSignedIn, getToken } = useAuth();
	const [repositoriesToShow, setRepositoriesToShow] = useState<string[]>([]);
	const {
		showModal: showRepositoryModal,
		hideModal,
		isModalShown,
	} = useModal();
	const [selectedRepository, setSelectedRepository] = useState<string>();
	const getRepositories = async () => {
		const token = await getToken();
		// call the API for repos
		const repositories = ["repo 1", "repo 2"];
		setRepositoriesToShow(repositories);
	};
	const {
		pendingActionsWhenSigned,
		retrievePendingAction,
		addPendingActionsWhenSigned,
	} = useUserState();
	const showRepositoryModalFlow = pipe(getRepositories, showRepositoryModal);
	const redirectToGHAuthFlow = pipe(
		() => addPendingActionsWhenSigned("openRepoModal"),
		() => router.push(authUrl),
	);
	const shouldOpenPendingRepoModal = retrievePendingAction("openRepoModal");
	console.log({ pendingActionsWhenSigned }, { shouldOpenPendingRepoModal });
	const selectRepository = (repository: string) => console.log(repository);

	useEffect(() => {
		if (shouldOpenPendingRepoModal && isSignedIn) showRepositoryModalFlow();
	}, [shouldOpenPendingRepoModal]);

	const dialog = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		if (isModalShown) dialog.current?.showModal();
	}, [isModalShown]);

	const ensureSignIn = isSignedIn
		? showRepositoryModalFlow
		: redirectToGHAuthFlow;
	return (
		<>
			<dialog ref={dialog} style={{ width: "500px", height: "500px" }}>
				<Select onValueChange={selectRepository} value={selectedRepository}>
					<SelectTrigger className="flex w-full select-none items-center font-semibold">
						<span
							className={cn("mr-[0.75rem] text-xs font-light text-slate-500", {
								"text-slate-200": isDark,
							})}
						>
							Select repository:
						</span>
						<SelectValue placeholder={selectedRepository} />
					</SelectTrigger>
					<SelectContent>
						{repositoriesToShow.map((e) => (
							<SelectItem
								key={e}
								value={e}
								className={cn({
									"font-semibold": selectedRepository === e,
								})}
							>
								{e}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</dialog>
			<div className="flex justify-between h-[50px] w-full flex-1 bg-white p-1">
				<Button
					variant="link"
					className="text-md -ml-1 pt-3 font-light text-gray-500 dark:text-gray-300"
				>
					<a href="/">
						<CodemodLogo />
					</a>
				</Button>
				<AuthButtons />
			</div>
			<div className="flex justify-between items-center h-[40px] w-full p-1 px-4">
				<div />
				<div className="flex gap-2">
					{/* FIXME: remove text-white and specific classNames once buttons are moved to the new design */}
					<Button
						size="xs"
						variant="outline"
						className="flex gap-1"
						hint={<p className="font-normal">Run Codemod</p>}
						onClick={ensureSignIn}
					>
						<CheckIcon className="h-4 w-4" />
						Run Codemod
					</Button>
					<Button
						size="xs"
						variant="outline"
						className="flex gap-1"
						hint={<p className="font-normal">Clear all inputs</p>}
						onClick={() => {
							setInput("");
							setOutput("");
							setContent("");
						}}
					>
						<BackspaceIcon className="h-4 w-4" />
						Clear all inputs
					</Button>
					<Button
						size="xs"
						variant="outline"
						className="flex gap-1"
						onClick={getShareLink}
						isLoading={isShareURLBeingCreated}
					>
						{/* FIXME: refactor button component to replace loading icon with the button's icon */}
						{!isShareURLBeingCreated && <LinkIcon className="h-4 w-4" />}
						Share
					</Button>
					{/* <Button
						size="xs"
						variant="outline"
						className="flex gap-1 pl-1"
						hint={
							<p className="font-normal">
								Download a ZIP archive to use this codemod in VS Code
							</p>
						}
					>
						<VSCodeIcon />
						Run in VS Code
					</Button> */}
					<DownloadZip />
				</div>
			</div>
			{/* <div className="flex h-[30px] w-full flex-1 items-center justify-end">
				<div className="flex items-center gap-3">
					<PublicLinkSharingButton />
					<Select onValueChange={onEngineChange} value={engine}>
						<SelectTrigger className="flex flex-1 select-none items-center font-semibold">
							<span
								className={cn(
									"mr-[0.75rem] text-xs font-light text-slate-500",
									{
										"text-slate-200": isDark,
									},
								)}
							>
								Codemod Engine:
							</span>
							<SelectValue placeholder={engine} />
						</SelectTrigger>
						<SelectContent>
							{enginesConfig.map((engineConfig, i) => (
								<SelectItem
									disabled={engineConfig.disabled}
									key={i}
									value={engineConfig.value}
									className={cn({
										"font-semibold": engine === engineConfig.value,
									})}
								>
									{engineConfig.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Tooltip
						trigger={
							<Button
								className="w-42 flex items-center justify-center"
								onClick={toggleTheme}
								size="sm"
								variant="outline"
							>
								<a
									rel="noopener noreferrer"
									target="_blank"
									href="https://join.slack.com/t/codemod-community/shared_invite/zt-2bqtla38k-QbWDh9Kwa2GFVtuGoqRwPw"
								>
									<SlackLogoIcon className="h-5 w-5" />
								</a>
							</Button>
						}
						content="Chat with codemod experts in the community"
					/>

					<Tooltip
						content='Toggle between "light" and "dark" theme'
						trigger={
							<Button
								className="w-42 flex items-center justify-center"
								onClick={toggleTheme}
								size="sm"
								variant="outline"
							>
								{isDark ? (
									<MoonStarsIcon className="h-5 w-5" />
								) : (
									<SunIcon className="h-5 w-5" />
								)}
							</Button>
						}
					/>
				</div>
			</div> */}
		</>
	);
};

export default Header;
