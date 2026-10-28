import { useState, useCallback } from "react";
import { loadFromFileList, loadFromCsvFile } from "../../../engine/load";
import { diagnose } from "../../../engine/diagnose";
import { buildGraph, type SystemGraph } from "../../../engine/buildGraph";

export type DiagnosisState = {
  loading: boolean;
  error: string | null;
  graph: SystemGraph | null;
  converged: boolean;
};

export function useDiagnosis() {
  const [state, setState] = useState<DiagnosisState>({
    loading: false,
    error: null,
    graph: null,
    converged: false,
  });

  const runFromFolder = useCallback(async (files: FileList, rootName: string) => {
    setState({ loading: true, error: null, graph: null, converged: false });
    try {
      const snapshot = await loadFromFileList(files, rootName);
      const result = diagnose(snapshot);
      const graph = buildGraph(snapshot, result.answers);
      setState({
        loading: false,
        error: null,
        graph,
        converged: result.converged,
      });
    } catch (e) {
      setState({
        loading: false,
        error: e instanceof Error ? e.message : "unknown error",
        graph: null,
        converged: false,
      });
    }
  }, []);

  const runFromCsv = useCallback(async (file: File) => {
    setState({ loading: true, error: null, graph: null, converged: false });
    try {
      const snapshot = await loadFromCsvFile(file);
      const result = diagnose(snapshot);
      const graph = buildGraph(snapshot, result.answers);
      setState({
        loading: false,
        error: null,
        graph,
        converged: result.converged,
      });
    } catch (e) {
      setState({
        loading: false,
        error: e instanceof Error ? e.message : "unknown error",
        graph: null,
        converged: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, graph: null, converged: false });
  }, []);

  return { ...state, runFromFolder, runFromCsv, reset };
}