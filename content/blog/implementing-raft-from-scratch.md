+++
title = "Implementing Raft from Scratch"
description = "Building a custom RPC library and Raft consensus from the ground up!"
date = "2025-03-26"
aliases = ["Distributed Systems","rpc", "raft"]
author = "Dhruv Patel"
+++

# Overview

So, let's get into creating a custom Remote Procedure Call (RPC) library in Go and the Raft consensus algorithm on top of it, developed as part of my [class](https://mews.sv.cmu.edu/teaching/14736/).

First we construct a RPC library designed to abstract network complexities, incorporating a multi-threaded TCP server for handling concurrent connections and a custom LeakySocket component to simulate packet loss and network delays.

Building on this foundation, now we will implement our Raft consensus algorithm, leveraging the RPC library to facilitate inter-node communication for leader election and log replication. Throughout this post, I try to remember the technical challenges encountered—such as ensuring thread safety through concurrency controls and optimizing election timeouts—and share insights gained from extensive testing and debugging of these systems.

## Crafting a Remote Objects Library

The goal was to create a Go library that makes remote objects feel local—think Java RMI, but leaner and meaner. It hides all the network mess (serialization, packet loss, threading) behind a clean interface.

### Our Java RMI RPC vs. gRPC: A Different Approach

Unlike gRPC, where you define services in `.proto` files and let the protoc compiler generate stub code for you, our approach is fundamentally different:

**How gRPC works:**

- You define services and message types in Protocol Buffers
- Run the protoc compiler to generate client/server code
- Import and use the generated stubs in your application
- The generated code handles serialization, connection management, etc.

**How our custom RPC works:**

- Define interfaces directly as Go structs with function fields
- Use reflection at runtime to create stubs dynamically
- No code generation step between writing and running code
- Manually handle serialization and connection issues

**Advantages of our approach:**

- No build-time (external) dependencies or code generation steps.
- More flexible - can adapt to interfaces at runtime allowing us to inject a unknown RPC protocol layouts.

**Disadvantages compared to gRPC:**

- Less optimized due to lack of separate framework for protocol definition and language specific optimizations, making it Go-specific rather than language-agnostic.
- More fragile - type mismatches caught at runtime, not compile time.

### What I Built

Two key players here: `CalleeStub` and `CallerStubCreator`.

- **CalleeStub**: The server-side hero. It hosts a remote object, runs a multi-threaded TCP server, and handles incoming calls. Check this snippet of it in action:

  ```go
  func (c *CalleeStub) handleConnection(conn net.Conn)
      defer conn.Close()
      // Lab test wrapper
      ls := NewLeakySocket(conn, c.lossy, c.delayed)
      data, err := ls.Recv()
      if err != nil { return }
      var req RequestMsg
      dec := gob.NewDecoder(bytes.NewBuffer(data))
      dec.Decode(&req)
      method := c.instance.MethodByName(req.Method)
      results := method.Call(req.Args)
      reply := ReplyMsg{Success: true, Reply: results}
      // Send it back!
  }

- **CallerStubCreator**: The client-side wizard. It uses Go’s reflection to turn local calls into network requests dynamically. Here’s a peek:

```go
  func CallerStubCreator(ifc interface{}, adr string, lossy bool, delayed bool) error {
    val := reflect.ValueOf(ifc).Elem()
    for i := 0; i < val.Type().NumField(); i++ {
        field := val.Type().Field(i)
        fn := reflect.MakeFunc(field.Type, func(args []reflect.Value) []reflect.Value {
            req := RequestMsg{Method: field.Name, Args: args}
            conn, _ := net.Dial("tcp", adr)
            ls := NewLeakySocket(conn, lossy, delayed)
            // Send request, get reply, return results
        })
        val.Field(i).Set(fn)
    }
    return nil
  }
```

### Cool Bits

**Reflection Magic**: Go's reflection, as described in the [Laws of Reflection](https://go.dev/blog/laws-of-reflection), allowed our RPC system to inspect and manipulate types at runtime. We used `reflect.ValueOf()` to examine interface values, `reflect.MakeFunc()` to create function values dynamically, and type introspection to serialize method calls. This let us generate client stubs without compile-time code generation. 

**Robust Architecture**: The multi-threaded server design in go effortlessly handles concurrent connections, while our LeakySocket component realistically simulates real-world network conditions by introducing controlled packet loss and delays. I tested the entire system with a shared to-do list application where multiple clients could remotely add or complete tasks—primitive but functional proof that the RPC layer works as intended.

![Screenshot of the to-do server and client running in terminal](/blog/example.png)
*The shared to-do list application running with server and multiple clients communicating through our custom RPC library*


## Raft Algo