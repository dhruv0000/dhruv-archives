# LangChain Overview

A concise one-page reference covering the core concepts taught across the LangChain modules.

### Notes:
- Streamlit can be used to create Data Apps. It has session_state

pydantic can be used to structure data and validate it. (PydanticToolsParser by langchain)

- MongoDb Atlas is a cloud vector store

- Uvicorn is an ASGI web server implementation for Python.

- Render can host apps

## 1. Models, Prompts & Output Parsers

* **LLM Configuration**: Connect to providers (e.g., OpenAI, Azure).
* **PromptTemplate**: Define reusable templates with input variables.

  ```python
  from langchain import PromptTemplate
  template = "Translate {text} to French."
  prompt = PromptTemplate(template=template, input_vars=["text"])
  ```
* **Output Parsers**: Convert raw LLM output into structured formats (e.g., Python dicts or Pydantic models).

  ```python
  from langchain.output_parsers import PydanticOutputParser
  ```

## 2. Memory

* **ConversationBufferMemory**: Stores full chat history.
* **ConversationBufferWindowMemory**: Keeps only the last N messages.
* **ConversationSummaryMemory**: Maintains a rolling summary of past exchanges.

  ```python
  from langchain.memory import ConversationBufferMemory
  memory = ConversationBufferMemory()
  ```
* **Evaluation**: Manually review or use LLM-assisted checks to validate memory relevance.

## 3. Chains

* **LLMChain**: Single-step LLM invocation.
* **SimpleSequentialChain / SequentialChain**: Run multiple chains back-to-back, optionally passing outputs as inputs.
* **RouterChain**: Dynamically route inputs to different sub-chains based on content.

  ```python
  from langchain import LLMChain
  chain = LLMChain(llm=llm, prompt=prompt)
  ```

## 4. Question & Answer (Q\&A)

* **Document Loading**: Load data via `UnstructuredFileLoader`, `PyPDFLoader`, etc.
* **Embeddings & Vector Stores**: Generate embeddings (`OpenAIEmbeddings`) and store/retrieve via `Chroma`, `FAISS`.
* **RetrievalQA**: Out-of-the-box QA using a retriever + LLM, with chain types like `map_reduce`, `refine`, and `stuff`.

  ```python
  from langchain.chains import RetrievalQA
  qa = RetrievalQA.from_chain_type(
      llm=llm, chain_type="map_reduce", retriever=retriever
  )
  answer = qa.run("What is LangChain?")
  ```
* You can also create a tool, instead of an agent using `create_retriever_tool`

## 5. Evaluation

* **Manual Evaluation**: Inspect LLM outputs against expected answers.
* **Automated Evaluators**: Use `LLMChainEvaluator`, `ChatGPTEvaluator` to score responses.
* **Metrics**: Support for exact match, F1, ROUGE, etc.

  ```python
  from langchain.evaluation import LLMChainEvaluator
  ```

## 6. Agents

* **Tools**: Wrap external functions or APIs (e.g., `SerpAPI`, custom Python functions) as `Tool` objects.
* **Agent Initialization**: Combine tools with an LLM and an agent type (`zero-shot-react-description`, `conversational-react`).

  ```python
  from langchain.agents import initialize_agent, Tool
  tools = [Tool(name="search", func=search_fn, description="Web search")]  
  agent = initialize_agent(
      tools, llm, agent="zero-shot-react-description", debug=True
  )
  ```
* **Examples**: Wikipedia lookup agent, Python REPL agent for code execution.

* **Other Agents**: create_react_agent, create_json_agent, or create_structured_chat_agent.

* Can use `checkpointer` in `create_react_agent` to persist state of chat.
- Use `StateGraph` to save order agent state
- It uses `config = {"configurable": {"thread_id": "abc123"}}` thread_id to tell checkpoint which conversation to load/save.

- **Reviewer**: 

## 7. LCEL & Runnables

* **LangChain Expression Language (LCEL)**: A concise DSL for composing **runnables**—objects like prompts, models, functions, or parsers—into executable pipelines.
* **Runnable**: Any component implementing an `.invoke()` API (e.g., `PromptTemplate`, `ChatModel`, custom functions, or output parsers).
* **Chaining**: Use the pipe operator (`|`) or the `.pipe()` method to build a `RunnableSequence` that feeds outputs into inputs:

  ```python
  from langchain_core.runnables import RunnableParallel
  chain = prompt | model | StrOutputParser()
  result = chain.invoke({"topic": "bears"})
  ```
* **Parallel Execution**: `RunnableParallel` accepts a dict of runnables and executes them in parallel, returning a dict of outputs.
* **Streaming**: Chained sequences support `.stream()` for token-level output as soon as it’s available.
* **Output Parsers**: Treat parsers (e.g., `StrOutputParser`, `PydanticOutputParser`) as the final runnable in a chain to coerce raw LLM responses into structured Python types.


## 8. RAG (Retrieval-Augmented Generation)

Pipeline Stages: Load → Split → Embed → Store

Query Flow: User Query → Retrieval → Context + Query → Answer Generation

Vector Store: Use Chroma (or other stores) with embedding models like OpenAI’s text-embedding-ada-002.

RunnablePassthrough: Integrate retrieved context into a chat chain seamlessly.


## Custom Agents (Langchain Tools and Functions)
- Can use @tool decorator to define agents
- llm.bind_tools

## 9. Multiple Retriever Query Analysis

A concise summary of handling multiple retrievers via query analysis and routing logic:

* **Setup**: Install dependencies (`langchain`, `langchain-community`, `langchain-openai`, `langchain-chroma`) and configure environment variables for OpenAI (and optionally LangSmith).
* **Index Creation**: Build separate Chroma vectorstores for different datasets (e.g., `harrison`, `ankush`) and wrap them as retrievers with custom `search_kwargs`.
* **Query Analysis**: Use function calling with `PydanticToolsParser` and `ChatPromptTemplate` to parse user questions into a structured `Search` model (fields: `query`, `person`).
* **Routing Logic**: Map parsed `person` values to the corresponding retriever via a simple dictionary lookup.
* **Custom Chain**: Define a `@chain` function (`custom_chain`) that invokes the query analyzer, selects the appropriate retriever, and returns retrieval results.
* **Usage Examples**: Demonstrate invoking `custom_chain.invoke("where did Harrison Work")` and `custom_chain.invoke("where did ankush Work")` to retrieve context dynamically.

This pattern enables dynamic selection of information sources based on user intent and structured parsing.
