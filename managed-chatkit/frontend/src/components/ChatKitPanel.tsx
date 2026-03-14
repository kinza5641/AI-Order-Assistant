import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: {
      colorScheme: 'light',
      radius: 'round',
      density: 'normal',
      color: {
        grayscale: {
          hue: 0,
          tint: 2,
          shade: -1
        },
        accent: {
          primary: '#5c1414',
          level: 1
        }
      },
      typography: {
        baseSize: 15,
        fontFamily: 'Inter, sans-serif',
        fontSources: [
          {
            family: 'Inter',
            src: 'https://rsms.me/inter/font-files/Inter-Regular.woff2',
            weight: 400,
            style: 'normal'
          }
        ]
      }
    },
    composer: {
      attachments: {
        enabled: true,
        maxCount: 5,
        maxSize: 10485760
      },
      tools: [
        {
          id: 'search_docs',
          label: 'Search docs',
          shortLabel: 'Docs',
          placeholderOverride: 'Search documentation',
          icon: 'book-open',
          pinned: false
        }
      ],
    },
    startScreen: {
      greeting: '',
      prompts: [
        {
          icon: 'circle-question',
          label: 'What is ChatKit?',
          prompt: 'What is ChatKit and what does it do?'
        }
      ]
    },
  }); 

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}
