AI Agents:
interact with env, make decision based on it.
Thought -> Action -> Observation -> Response or Thought

Key Aspect: Redundancy and failover mechanism

Type of Language Model: - Auto-regressive (for text generation NLG), auto-encoding (not for text gen, but for classification and embedding + retrieval tasks, NLP)

- Agent rely on auto-regressive to check if task is done or not.

- ReAct: Philosophy, get tool, let it run till it is satisfied (reacting...)
    - Nx(Thought, Action, Action Input, Observation)

- Few Shot Learning: Telling it how to do it; make then do again
- Chain of Thought: Force reasoning, before answer

- More tools can add bias

---

Agent Eval
 - Response Time (infinite loop)
 - Accuracy (For factual data)
 - Task Completion Rate (How efficient it is)
 - Bias in Decision Making (need retraining)
 - Expandability (not be black boxes)

How to eval what to use?
- Gen Task -> Multiple Choice (pick a bucket/tool) or Free Text Response (Retain/remix semantic info)
- Understanding Task -> Classification (pick a bucket) or Embeddings (Retain/remix semantic info)

Tool Selection Stats (Multiple Choice)
 - Accuracy: Overall correct predictions
 - Precision: What it was correct/ when was selected
 - Recall: Times tool selected / Times it should have selected (Dont know when to use)

- Order of Tool Matter: "Positional Bias" (middle prompt values are more suspectable to ignore)

Agent Responses based on Model (Free Text Eval)
 - If have ground truth, can do semantic search
 - Can create a rubric of what you want to eval (your bias in eval prompt + model bias)
  - Rubric can be individually or with each other.

Agent Response based on Prompt
 - Human Eval (expensive)
 - LLM Eval (Positional Bias can kick in your butt) 
    - Can be used for error checking
    - Can be scale with COT on or off
    
---

How to improve ReAct?
 - Plan with big llm, execute with small llm and replan using large llm.
    - Can use `union` in pydantic to have list of responses or next Plan instead.

 - Reflection Agent: Reflect and retry until good
    - Infinite loop is bad

When it fails?
 - choose wrong tool
    - Make tools exclusive in selection
    - Make Temp low
 - Wrong correct output
    - Plan the workflow first
    - Feedback loop during output (can add latency)
 - LLM can go through loop
    - Give a deadline
 - Tool fails
    - Handle Gracefully and try again

---
More things?

- Real time API is needed the most (Can be an API)
- Hallucination can be avoided by real time data. i.e grounding the agent
- Testing in modules
- Make feedback loop
- Ethics are blurry (compliance)
- Audit agent?

- Collaborative Multi-Agent Systems

---
- LangChain: Original as llm. Make stateful workflows.
    - Pandatic: Data type hints
    - LangSmith Hub: Prompt Gallery
    - Can add add_conditional_edges and edges, nodes etc on a agent graph
    - SerpAPI for google Search

- CrewAI: Role-based AI agents. Supports hierarchical and sequential task delegation.
    - Is ReAct based
    - They use chroma vector store under the hood
    - Can use lang chain
    - @tool to create new tool or `BaseTool` with _run()

- OpenAI Swarm (stateless)
- Streamlit: For apps

- AutoGen (Microsoft): Distributed System

- Personal Agent:
    - Make a ToolInterface/BaseTool using padatic (name, description)
    - Nx(Thought, Action, Action Input, Observation)
    - Make a tool using that interface
    - `@lru_cache` for as many queries
    - Supabase: Third-Party database provider to save prompts
    - Pinecone: Vector Database with OpenAI embeddings
