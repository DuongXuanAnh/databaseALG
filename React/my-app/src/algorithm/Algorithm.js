export class Algorithm {
    
    constructor() {
        this.subset = this.subset.bind(this);
        this.onlyUnique = this.onlyUnique.bind(this);
        this.intersection = this.intersection.bind(this);
        this.difference = this.difference.bind(this);

        this.isDependencyInClosure = this.isDependencyInClosure.bind(this);
        this.isAttributeRedundant = this.isAttributeRedundant.bind(this);
        this.getReducedAttributes = this.getReducedAttributes.bind(this);

        this.rewriteFDSingleRHS = this.rewriteFDSingleRHS.bind(this);
        this.removeTrivialFDs = this.removeTrivialFDs.bind(this);
        this.attributeClosure = this.attributeClosure.bind(this);
        this.minimizeLHS = this.minimizeLHS.bind(this);
        this.removeDependency = this.removeDependency.bind(this);
        this.removeRedundantFDs = this.removeRedundantFDs.bind(this);

        this.minimalCover = this.minimalCover.bind(this);

        this.findFirstKey = this.findFirstKey.bind(this);
        this.getAllKeys = this.getAllKeys.bind(this);

        this.powerSet = this.powerSet.bind(this);
        this.printClosurePowerSet = this.printClosurePowerSet.bind(this);

    }

     // A is a subset of B -> true
    subset(setA, setB) {
        return setA.every(val => setB.includes(val));
    }

    // Removes duplicates in a set
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    intersection (arr1, arr2) {
        return arr1.filter(value => arr2.includes(value));
    }

     // Typicky odecitani mnozin arr1 - arr2
     difference(arr1, arr2){
        let difference = arr1.filter(x => !arr2.includes(x));
        return difference;
    }

    // Algorithm to determine if the right-hand side is a subset of X+
    isDependencyInClosure(F, X, Y) {
        console.log("------------------");
        console.log(F.map(fd => fd.left));
        console.log("------------------");

        const leftAttributes = F.map(item => item.left);
        const rightAttributes = F.map(item => item.right);
        return this.subset(Y, this.attributeClosure(leftAttributes, rightAttributes, X));

    }

    // Algorithm to determine if an attribute is redundant or not.
    isAttributeRedundant(F, X, Y, a) {
        const newX = X.filter(attr => attr !== a); // X – {a}
        return this.isDependencyInClosure(F, newX, Y);
    }

    getReducedAttributes(F, X, Y) {
        let XPrime = [...X]; // X’ := X;
        for (let a of X) {
            if (this.isAttributeRedundant(F, XPrime, Y, a)) {
                XPrime = XPrime.filter(attr => attr !== a); // X’ := X’ – {a};
            }
        }
        return XPrime;
    }

    // Split functional dependencies so that each dependency on the right-hand side (RHS) has only one attribute
    rewriteFDSingleRHS(leftAttributes, rightAttributes) {
        
        let result = [];
    
        for (let i = 0; i < leftAttributes.length; i++) {
            let left = leftAttributes[i];
            for (let j = 0; j < rightAttributes[i].length; j++) {
                let right = [rightAttributes[i][j]];
                result.push([left, right]);
            }
        }
    
        return result;
    }

    // Remove trivial FDs (those where the RHS is also in the LHS).
    removeTrivialFDs(fds) {
        return fds.filter(fd => !this.subset(fd[1], fd[0]));
    }

    // Calculate the closure of a set of attributes with respect to a set of FDs.
    attributeClosure(leftAttributes, rightAttributes, attributesPlus) {
        let closureX = [...attributesPlus];  // Using spread to ensure we're working with a copy
        let previousClosure;
        do {
            previousClosure = [...closureX];
            for (let i = 0; i < leftAttributes.length; i++) {
                if (this.subset(leftAttributes[i], closureX) && !this.subset(rightAttributes[i], closureX)) {
                    closureX = [...new Set(closureX.concat(rightAttributes[i]))];  // Ensuring uniqueness using Set
                }
            }
        } while (previousClosure.length !== closureX.length);  // keep looping until no new attributes are added
    
        return closureX;
    }


     // Minimize the left-hand side after removing trivial FDs
     minimizeLHS(FDs) {
        const leftAttributes = FDs.map(fd => fd[0]);
        const rightAttributes = FDs.map(fd => fd[1]);

        let minimizedFDs = [];
        
        for (let i = 0; i < leftAttributes.length; i++) {
            let currentLHS = leftAttributes[i];
            let currentRHS = rightAttributes[i];
            
            for (let j = 0; j < currentLHS.length; j++) {
                // Temporarily remove the attribute
                let tempLHS = [...currentLHS];
                tempLHS.splice(j, 1);
                
                // Compute the closure of the temporary LHS
                let closure = this.attributeClosure(leftAttributes, rightAttributes, tempLHS);

                // Check if the closure still contains the RHS
                if (this.subset(currentRHS, closure)) {
                   
                    currentLHS = tempLHS;  // The removed attribute is redundant
                }
            }

            minimizedFDs.push([currentLHS, currentRHS]);
        }
        return minimizedFDs;

    }

    removeDependency(leftAttributes, rightAttributes, currentLHS, currentRHS) {
        // Find the index of the FD to be removed based on its LHS and RHS.
         const index = leftAttributes.findIndex((attr, idx) => 
            JSON.stringify(attr) === JSON.stringify(currentLHS) && 
            rightAttributes[idx] === currentRHS
        );

        // If FD is not found, return the original arrays without modification.
        if (index === -1) return [leftAttributes, rightAttributes];

        // Remove the FD from both left and right attributes arrays.
        leftAttributes.splice(index, 1);
        rightAttributes.splice(index, 1);

        return [leftAttributes, rightAttributes];
    }

    removeRedundantFDs(fds) {
        // Step 1: Remove duplicates
        const stringifyFDs = fds.map(JSON.stringify);
        const setOfFDs = new Set(stringifyFDs);
        let uniqueFDs = Array.from(setOfFDs).map(JSON.parse);
        
        // Step 2: Filter out redundant FDs
        let index = 0;
        while (index < uniqueFDs.length) {
            const fd = uniqueFDs[index];
            const lhs = fd[0];
            const rhs = fd[1];
            
            // Step 2.1: Create a temporary list of FDs without the current FD
            const tempFDs = [...uniqueFDs.slice(0, index), ...uniqueFDs.slice(index + 1)];
            
            // Compute left and right attributes from tempFDs
            let tempLeftAttributes = tempFDs.map(fd => fd[0]);
            let tempRightAttributes = tempFDs.map(fd => fd[1]);
            
            // Step 2.2: Compute the attribute closure
            const closure = this.attributeClosure(tempLeftAttributes, tempRightAttributes, lhs);
            
            // Step 2.3: Check if rhs is a subset of closure
            const isRedundant = this.subset(rhs, closure);
            
            // Step 2.4: If redundant, remove from the list
            if (isRedundant) {
                uniqueFDs.splice(index, 1); // Remove the redundant FD
            } else {
                index++; // Move to the next FD
            }
        }
        
        // Step 3: Return the final result
        return uniqueFDs;
    }
    

    minimalCover(leftAttributes, rightAttributes) {        
        const initialRewrittenFDs = this.rewriteFDSingleRHS(leftAttributes, rightAttributes);
        const nonTrivial_FDs = this.removeTrivialFDs(initialRewrittenFDs);
        const minimizeLHS_FDs = this.minimizeLHS(nonTrivial_FDs);
        return this.removeRedundantFDs(minimizeLHS_FDs);
    }


    findFirstKey(leftAttributeInput, rightAttributeInput, schema) {
        let candidateKey = [...schema];
        let output = [];
    
        for (let attr of schema) {
            output.push(candidateKey.join(', ') + ' -> ' + schema.join(', '));
    
            output.push(`Zkusíme odstranit '${attr}'`);
    
            // Vytvoříme potenciální klíč bez aktuálního atributu
            const potentialKey = candidateKey.filter(item => item !== attr);
    
            // Vypočítáme uzávěr potenciálního klíče
            const closure = this.attributeClosure(leftAttributeInput, rightAttributeInput, potentialKey);
    
            output.push('Podíváme se na atributový uzávěr');
            output.push(`(${potentialKey.join(', ')})+ = ${closure.join(', ')}`);
    
            if (this.subset(schema, closure)) {
                output.push(`-> '${attr}' je redudantní, můžeme odstranit`);
                candidateKey = potentialKey;
            } else {
                output.push(`-> '${attr}' není redudantní, tak ho tam musíme nechat`);
            }
        }
    
        output.push('=> Dostaneme první klíč: ' + candidateKey.join(', '));
    
        return {
            candidateKey: candidateKey,
            outputText: output
        };
    }

   

    getAllKeys(F, A) {
        // // Convert F into left and right attributes for easier handling
        let leftAttributes = F.map(fd => fd[0]);
        let rightAttributes = F.map(fd => fd[1]);
        // Initialization
        let Q = [];
        let N = this.findFirstKey(leftAttributes, rightAttributes, A).candidateKey;
        let Keys = [N];
        Q.push(N);
    
        while (Q.length > 0) {
            let K = Q.shift(); // POP operation on the queue
    
            for (let i = 0; i < leftAttributes.length; i++) {
                let X = leftAttributes[i];
                let Y = rightAttributes[i];


                if (this.intersection(Y, K).length > 0 && !this.subset(X, K)) {

                    let newPossibleKey = this.difference(K.concat(X).filter(this.onlyUnique), Y);

                    let newKey = this.getReducedAttributes({left: leftAttributes, right: rightAttributes}, newPossibleKey, A);

                    if(!Keys.some(key => this.subset(newKey, key) && this.subset(key, newKey))){
                        Keys.push(newKey);
                        Q.push(newKey); 
                    }

                }
            }
        }
    
        return Keys;
    }

    // množina všech podmnožin
    powerSet(array) {
        const result = [];
        const f = function(prefix, array) {
            for (let i = 0; i < array.length; i++) {
                result.push(prefix.concat(array[i]));
                f(prefix.concat(array[i]), array.slice(i + 1));
            }
        };
        f([], array);

        // Uspořádání výsledků podle počtu atributů v každé podmnožině
        result.sort((a, b) => a.length - b.length);
        return result;
    }

    printClosurePowerSet(F, powerSet){
        const leftAttributes = F.map(dep => dep.left);
        const rightAttributes = F.map(dep => dep.right);

        for(let i = 0; i < powerSet.length; i++){
            console.log(`{${powerSet[i]}}+ = {${this.attributeClosure(leftAttributes, rightAttributes, powerSet[i])}}`);         
        }
    }

    
    printFPlus(F, powerSet) {
        const leftAttributes = F.map(dep => dep.left);
        const rightAttributes = F.map(dep => dep.right);

        let closure = [];

        let DPs_map = new Map();
        let key;
        let value;

        for(let i = 0; i < powerSet.length; i++){

            closure = this.attributeClosure(leftAttributes, rightAttributes, powerSet[i]);

            if(powerSet[i].length !== closure.length){ // Zbavime se trivialnich prikladu
                key = this.getReducedAttributes(F, powerSet[i], this.difference(closure, powerSet[i]));
                value = this.difference(closure, powerSet[i]);

                DPs_map.set(key, value);
            }
        }

        for (let [key, value] of DPs_map) {
            console.log(key + " -> " + value);
        }
    }
    

}
