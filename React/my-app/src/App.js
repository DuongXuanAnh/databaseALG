import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Attribute from './components/content/attribute/Attribute';
import { AttributeProvider } from './contexts/AttributeContext';
import EditDependency from './components/content/dependency/mobile/EditDependency';
import Dependency from './components/content/dependency/Dependency';
import { DependencyProvider } from './contexts/DependencyContext';
import AddDependency from './components/content/dependency/mobile/AddDependency';
import Problems from './components/content/problems/Problems';

import { AllKeys, Decomposition, FirstKey, MinimalCover, RedundantDependency, RedundantAttribute, Synthesis, Derivability } from './components/content/problems';

function App() {
  return (
    <AttributeProvider>
      <DependencyProvider>
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Attribute />} />
      <Route path="/dependencies" element={<Dependency />} />
      <Route path="/addDependency" element={<AddDependency />} />
      <Route path="/editDependency/:id" element={<EditDependency />} />
      <Route path="/problems" element={<Problems />} />
      
      <Route path="/problems/allKeys" element={<AllKeys />} />
      <Route path="/problems/decomposition" element={<Decomposition />} />
      <Route path="/problems/firstKey" element={<FirstKey />} />
      <Route path="/problems/minimalCover" element={<MinimalCover />} />
      <Route path="/problems/derivablity" element={<Derivability />} />
      <Route path="/problems/redundantDependency" element={<RedundantDependency />} />
      <Route path="/problems/redundantAttribute" element={<RedundantAttribute />} />
      <Route path="/problems/synthesis" element={<Synthesis />} />
    </Routes>
  </Router>
  </DependencyProvider>
  </AttributeProvider>
  );
}

export default App;
