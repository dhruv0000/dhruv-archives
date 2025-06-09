## LammaIndex: Building Argentic AI System with Devs
Tech Stack:
- LammaIndex:
    - Has a common `Settings`
- OpenAIEmbeddings / Cohere Embeddings

- Creating RAG:
    - SimpleDirectoryReader -> get_nodes_from_documents (or SentenceSplitter) -> VectorStoreIndex -> as_query_engine (retriever in langchain)

- Tools
    - QueryEngineTool (to create tools) / or FunctionTool
    - RouterQueryEngine (to say how to select tools)
    - LLMSingleSelector (no need to choose)
    - Can use toolspecs to get community tools
    - Can use `FunctionTool` to initiate it.

- Agent
    - FunctionCallingAgentWorker (agent worker)
    - AgentRunner (agent Orchestrator)
    - ReActAgent (prebuild reAct agent with tools)

- Can run async using `.achat()`

- Workflows: Equivalent to LangGraph, but has events (edge) and steps (nodes)
    - Data can be shared in workflows too:
        - Instance Vars: Initial input, user input
        - Global context: cache between steps (Can use `ChatMemoryBuffer` to store memory)
        - Event Attributes: I/O of steps
```
#Define a custom ContinueEvent that inherits from Event
class ContinueEvent(Event):
    iterations: int

#Define a workflow class inheriting from Workflow
class SimpleWorkFlow(Workflow):

    #Any initialization steps needed here
    def __init__ (
        self,
        *args: Any,
        max_iterations: int, #Pass custom parameters too.
        **kwargs: Any,
    ) -> None:

        #Initialize the super class
        super().__init__(*args, **kwargs)
        #Store input into instance variables
        self.max_iterations = max_iterations


    #First step
    @step
    async def runLoop(self, 
                    ctx: Context, 
                    event : StartEvent | ContinueEvent ) -> ValidateEvent :
```
---
Planner: Clearing plan with inventory of tools; can use memory too

Orchestrator: Invoke planner, trigger executor, track workflow

Task Exec: Run tasks; ie. tools
    - `OureyEngineTools`

---

Reflection Pattern: Eval Output
Tool Use: Use tool
Router Pattern: if, else path
Planning: Create sub goal
Multi-Agent: Use multiple agent to work together


## AutoGen
TechStack:

- Conda/Anaconda: Python mgmt service for AI/ML stuff

- tavily python: Get real-time data

- AutoGen Studio: Rapid prototype AI agents (not all features)
    - Build: Build agent
        - Skills/Tools: Python Functions
            - register_for_llm: Know to use it
            - register_for_execution: Can execute it (mostly for userProxy)
            - register_function (above both in one)
        - Models:
        - Agents:
            - Conversable Agent: LLMs, code executors, and human-in-the-loop or just agent in loop
                - Can have exit condition too
                - Can provide Price/token use too
            - UserProxyAgent: code executors, and human-in-the-loop
            - AssistantAgent: LLMs
            - GroupChatManager: LLMs, and groups
                - Can define no of rounds and agents in GroupChat
                - Can use allowed_or_disallowed_speaker_transactions
        - Workflow:
            - Autonomous:
            - Sequential:
    - Playground: Run agent

- Nested Chats (Chain): Defined as dictionary of tasks

- AutoGen can run code in cli or docker
    - LocalCommandLineCodeExecutor (also has workingDir)
        - Can add tools here too

Teachable Agents: Learn from and retain new information.
    - Uses chromadb to have memory
    - `Teachability` to create and add to (Conversable) agent. Can set reset on/of for each conservation.

---

## ChatGPT Operators
- Give access to browser, mouse and keyboard