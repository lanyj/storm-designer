import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GraphCreator } from './scene/graph-creator';
import { Operator } from './operator';
import { DiagramNode } from './scene/diagram-node';
import resultAnimator from './scene/result-animator';
import { DiagramEdge } from './scene/diagram-edge';
import { Subscribe } from './node-types';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {
  private selectedCreationOption: any;
  private selectItemSubject: Subject<Operator>;
  private controlSubject: Subject<string>;
  private animationHasFinished: Boolean = false;

  private nodesList: Array<DiagramNode> = [];
  private edgeList: Array<DiagramEdge> = [];

  public removeItemSubject;

  constructor() {
    this.selectItemSubject = new Subject();
    this.removeItemSubject = new Subject();
    this.controlSubject = new Subject();
  }

  public setCreationOption(selectedCreation) {
    this.selectedCreationOption = selectedCreation;
  }

  public getCreationOption() {
    return this.selectedCreationOption;
  }

  public removeSelectedItem() {
    this.removeItemSubject.next();
  }

  /**
   * setSelectedItem reactive change selected item
   * @param selectedItem : any its an edge or node
   */
  public setSelectedItem(selectedItem) {
    this.selectItemSubject.next(selectedItem);
  }

  public getSelectedItem() {
    return this.selectItemSubject;
  }

  public controlScene(command) {
    this.controlSubject.next(command);
  }

  public getControlChanges() {
    return this.controlSubject;
  }

  public getData() {
    return { edges: this.edgeList, nodes: this.nodesList };
  }
  public getDefaultSampleData() {
    const xLoc = window.innerWidth / (window.innerWidth < 600 ? 2 : 3);
    const yLoc = 100;
    const data = JSON.parse('{"nodes":[{"id":26,"x":134,"y":113,"node_type":"BatchSpout","properties":{"name":"","interval":1000,"length":10,"fields":"x"}},{"id":27,"x":129,"y":306,"node_type":"FunctionBolt","properties":{"name":"","functionType":{"desc":"","text":"each function","name":"each"},"inputFields":"","outputFields":""}},{"id":28,"x":336,"y":109,"node_type":"BatchSpout","properties":{"name":"","interval":1000,"length":10,"fields":"x"}},{"id":29,"x":640,"y":112,"node_type":"BatchSpout","properties":{"name":"","interval":1000,"length":10,"fields":"x"}},{"id":30,"x":848,"y":115,"node_type":"BatchSpout","properties":{"name":"","interval":1000,"length":10,"fields":"x"}},{"id":31,"x":846,"y":313,"node_type":"FunctionBolt","properties":{"name":"","functionType":{"desc":"","text":"each function","name":"each"},"inputFields":"","outputFields":""}},{"id":32,"x":635,"y":312,"node_type":"MergeBolt","properties":{"fields":""}},{"id":33,"x":335,"y":312,"node_type":"JoinBolt","properties":{"name":"","inputFieldsA":"","inputFieldsB":"","outputFields":""}},{"id":35,"x":491,"y":197,"node_type":"BatchSpout","properties":{"name":"","interval":1000,"length":10,"fields":"x"}},{"id":36,"x":494,"y":576,"node_type":"Subscribe","properties":{}},{"id":37,"x":491,"y":419,"node_type":"MergeBolt","properties":{"fields":""}}],"edges":[{"source":26,"target":27},{"source":29,"target":32},{"source":30,"target":31},{"source":31,"target":32},{"source":28,"target":33},{"source":27,"target":33},{"source":33,"target":37},{"source":35,"target":37},{"source":32,"target":37},{"source":37,"target":36}]}');
    const nodes = data.nodes;
    const edges = data.edges;
    return { edges, nodes };
  }

  public get delay(): number {
    return GraphCreator.animateTime;
  }
  public set delay(value) {
    GraphCreator.animateTime = value;
    if (this.animationHasFinished) {
      this.refreshRxObjects();
    }
  }

  public refreshRxObjects() {
    const nodes = this.nodesList;
    const edges = this.edgeList;
    this.animationHasFinished = false;

    // DISPOSE created rx objects
    for (const node of nodes) {
      node.data.dispose();
    }

    resultAnimator.reset();
    resultAnimator.start(this.delay);

    let levelcounter = 1;
    // Make Creator Observables
    for (const node of nodes) {
      if (!node.data.rx && node.data.maxInput === 0) {
        node.data.run(node, levelcounter);
      }
    }

    // Connect Nodes By Edges
    let notFinished = true;
    while (notFinished) {
      levelcounter++;
      notFinished = false;
      const nodesNeedsRx = nodes.filter(n => !n.data.rx);
      for (const eachNode of nodesNeedsRx) {
        const nodeInputs = edges.filter(e => e.target === eachNode).map(e => e.source);
        eachNode.data.graphInputs = [];
        if (eachNode.data.areInputsReady(nodeInputs)) {
          eachNode.data.graphInputs = nodeInputs.map(node => ({ observable: node.data.rx, node: node }));
          eachNode.data.run(eachNode, levelcounter);
          notFinished = true;
          break;
        }
      }
    }

    const finishSubjects: Array<Subject<object>> = nodes
      .filter(n => n.data.title === 'Subscribe')
      .map(subscribeNode => (subscribeNode.data as Subscribe).finishSubject);

    zip(...finishSubjects).pipe(take(1)).subscribe(() => {
      resultAnimator.hasFinished.pipe(take(1)).subscribe(() => {
        this.animationHasFinished = true;
      });
    });
  }
}
