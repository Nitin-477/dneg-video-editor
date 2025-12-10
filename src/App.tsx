import { EditorProvider } from './store/EditorContext';
import { VideoEditor } from './components/VideoEditor/VideoEditor';

function App() {
  return (
    <EditorProvider>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#121212' }}>
        <VideoEditor />
      </div>
    </EditorProvider>
  );
}

export default App;
