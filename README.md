# Storm Visualization Designer

## Visualizing Examples

**Sentence-Word-Count**

* [Sentence-Word-Count-Designer](https://lanyj.github.io/storm-designer/load/{"nodes":[{"id":38,"x":282.5861053466797,"y":140.65786743164062,"node_type":"BatchSpout","properties":{"name":"SentenceSpout","interval":1000,"length":10,"fields":"sentence"}},{"id":39,"x":544.6744995117188,"y":374.97418212890625,"node_type":"Subscribe","properties":{}},{"id":40,"x":281.59221267700195,"y":383.8403625488281,"node_type":"FunctionBolt","properties":{"name":"SplitFunction","functionType":"0","inputFields":"sentence","outputFields":"word"}},{"id":41,"x":541.4044799804688,"y":132.62777709960938,"node_type":"GroupByBolt","properties":{"type":0,"fields":"word"}},{"id":42,"x":779.5776672363281,"y":130.21442413330078,"node_type":"PersistentAggregate","properties":{"stateFactoryName":"","inputFields":"word","outputFields":"count","aggregatorType":"0","aggregatorName":""}},{"id":43,"x":778.8765258789062,"y":376.4387512207031,"node_type":"NewValuesStream","properties":{}}],"edges":[{"source":38,"target":40},{"source":40,"target":41},{"source":41,"target":42},{"source":42,"target":43},{"source":43,"target":39}]} "Sentence-Word-Count")

* [Sentence-Word-Count-Source](https://www.lanyj.cn/StormDesignerExamples/SentenceWordCount-src.zip "Sentence-Word-Count-Source")

* [Sentence-Word-Count-Exec](https://www.lanyj.cn/StormDesignerExamples/SentenceWordCount-exec.jar "Sentence-Word-Count-Exec")
