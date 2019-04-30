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

  private showFlower: Boolean = false;

  constructor() {
    this.selectItemSubject = new Subject();
    this.removeItemSubject = new Subject();
    this.controlSubject = new Subject();
  }

  public getShowFlower(): Boolean {
    return this.showFlower;
  }

  public setShowFlower(b: Boolean) {
    this.showFlower = b;
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
    const data = JSON.parse('{"nodes":[{"id":38,"x":548.2513427734375,"y":107.79948425292969,"node_type":"BatchSpout","properties":{"name":"SentenceSpout","interval":1000,"length":10,"fields":"sentence"}},{"id":39,"x":545.2513427734375,"y":502.79949951171875,"node_type":"Subscribe","properties":{}},{"id":40,"x":549.2513427734375,"y":308.79949951171875,"node_type":"FunctionBolt","properties":{"name":"PrintFunction","functionType":"0","inputFields":"sentence","outputFields":""}}],"edges":[{"source":38,"target":40},{"source":40,"target":39}]}');
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

    if (!this.showFlower) {
      return;
    }

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
