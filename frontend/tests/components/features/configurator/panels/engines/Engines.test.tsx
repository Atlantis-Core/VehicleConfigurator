import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import EngineSelection from '../../../../../../src/components/features/configurator/panels/engines/Engines';
import { Engine } from '../../../../../../src/types/types';
import { setSelectedEngine } from '../../../../../../src/state/configuration/configurationSlice';
import { selectConfiguration, selectSelectedOptions } from '../../../../../../src/state/configuration/selectors';

const mockDispatch = vi.fn();
const mockUseAppSelector = vi.fn();

vi.mock('@state/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: Function) => mockUseAppSelector(selector),
}));

vi.mock('../../../../../../src/components/features/configurator/panels/engines/Engines.module.css', () => ({
  default: {
    categoryContent: 'categoryContent',
    engineList: 'engineList',
    engineItem: 'engineItem',
    selected: 'selected',
    engineName: 'engineName',
    engineDescription: 'engineDescription',
    engineDetails: 'engineDetails',
  },
}));


const mockEngines: Engine[] = [
  { id: 1, name: 'Standard Engine', description: 'A good basic engine.', brand: 'BMW', additionalPrice: 0 },
  { id: 2, name: 'Performance Engine', description: 'More power!', brand: 'Mercedes', additionalPrice: 5000 },
  { id: 3, name: 'Range Durable Engine', description: 'Up to 1.000.000km durability!', brand: 'Porsche', additionalPrice: 3000 },
];

const getEngineListItem = (engineName: string) => {
  const allListItems = screen.getAllByRole('listitem');
  return allListItems.find(item => within(item).queryByText(engineName));
};

describe('EngineSelection Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockUseAppSelector.mockClear();
  });

  test('renders the "Engine" heading', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: [] };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });
    render(<EngineSelection />);
    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument();
  });

  test('renders a list of engines with their details', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getAllByRole('listitem')).toHaveLength(mockEngines.length);

    mockEngines.forEach(engine => {
      expect(screen.getByText(engine.name)).toBeInTheDocument();
      expect(screen.getByText(engine.description)).toBeInTheDocument();
      expect(screen.getByText(`+${engine.additionalPrice.toLocaleString()} €`)).toBeInTheDocument();
    });
  });

  test('highlights the selected engine', () => {
    const initiallySelectedEngine = mockEngines[1]; // Performance Engine
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: initiallySelectedEngine };
      return undefined;
    });

    render(<EngineSelection />);

    const selectedEngineElement = getEngineListItem(initiallySelectedEngine.name);
    expect(selectedEngineElement).toHaveClass('selected');

    const otherEngineElement = getEngineListItem(mockEngines[0].name);
    expect(otherEngineElement).not.toHaveClass('selected');
  });

  test('dispatches setSelectedEngine action when an engine is clicked', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);

    const engineToSelect = mockEngines[0];
    const engineElement = getEngineListItem(engineToSelect.name);

    fireEvent.click(engineElement!);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelectedEngine(engineToSelect));
  });

  test('renders correctly when no engines are available', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: [] };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);
    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});

describe('EngineSelection Component - Systematic Testing', () => {
  // Äquivalenzklassen für engines Array
  const equivalenceClasses = {
    engines: {
      empty: [],
      single: [mockEngines[0]],
      multiple: mockEngines,
      withZeroPrice: [
        { id: 1, name: 'Free Engine', description: 'No cost', brand: 'BMW', additionalPrice: 0 }
      ],
      withHighPrice: [
        { id: 1, name: 'Premium Engine', description: 'Expensive', brand: 'Ferrari', additionalPrice: 50000 }
      ]
    },
    selectedEngine: {
      null: null,
      validSelection: mockEngines[0],
      invalidSelection: { id: 999, name: 'Non-existent', description: '', brand: 'Unknown', additionalPrice: 0 }
    }
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    mockUseAppSelector.mockClear();
  });

  // Test 1: Leeres engines Array
  test('should handle empty engines array correctly', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: equivalenceClasses.engines.empty };
      if (selector === selectSelectedOptions) return { selectedEngine: equivalenceClasses.selectedEngine.null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // Test 2: Einzelner Engine
  test('should handle single engine correctly', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: equivalenceClasses.engines.single };
      if (selector === selectSelectedOptions) return { selectedEngine: equivalenceClasses.selectedEngine.null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText(equivalenceClasses.engines.single[0].name)).toBeInTheDocument();
  });

  // Test 3: Engine mit Preis 0
  test('should display zero price correctly', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: equivalenceClasses.engines.withZeroPrice };
      if (selector === selectSelectedOptions) return { selectedEngine: equivalenceClasses.selectedEngine.null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByText('+0 €')).toBeInTheDocument();
  });

  // Test 4: Engine mit hohem Preis
  test('should format high prices correctly', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: equivalenceClasses.engines.withHighPrice };
      if (selector === selectSelectedOptions) return { selectedEngine: equivalenceClasses.selectedEngine.null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByText('+50,000 €')).toBeInTheDocument();
  });
});

describe('EngineSelection - Decision Table Testing', () => {
  /*
  Entscheidungstabelle:
  
  Bedingungen:           | T1 | T2 | T3 | T4 | T5 |
  engines.length > 0     | F  | T  | T  | T  | T  |
  selectedEngine exists  | -  | F  | T  | T  | F  |
  selection in engines   | -  | -  | T  | F  | -  |
  
  Aktionen:
  Show heading           | T  | T  | T  | T  | T  |
  Show engine list       | F  | T  | T  | T  | T  |
  Highlight selection    | F  | F  | T  | F  | F  |
  Enable click handler   | F  | T  | T  | T  | T  |
  */

  beforeEach(() => {
    mockDispatch.mockClear();
    mockUseAppSelector.mockClear();
  });

  // T1: Keine Engines verfügbar
  test('T1: No engines available', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: [] };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument(); // Show heading: T
    expect(screen.queryAllByRole('listitem')).toHaveLength(0); // Show engine list: F
  });

  // T2: Engines verfügbar, keine Auswahl
  test('T2: Engines available, no selection', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument(); // Show heading: T
    expect(screen.getAllByRole('listitem')).toHaveLength(mockEngines.length); // Show engine list: T

    // Kein Engine sollte als selected markiert sein
    const allListItems = screen.getAllByRole('listitem');
    allListItems.forEach(item => {
      expect(item).not.toHaveClass('selected'); // Highlight selection: F
    });
  });

  // T3: Engines verfügbar, gültige Auswahl
  test('T3: Engines available, valid selection', () => {
    const selectedEngine = mockEngines[1];
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument(); // Show heading: T
    expect(screen.getAllByRole('listitem')).toHaveLength(mockEngines.length); // Show engine list: T

    const selectedEngineElement = getEngineListItem(selectedEngine.name);
    expect(selectedEngineElement).toHaveClass('selected'); // Highlight selection: T
  });

  // T4: Engines verfügbar, ungültige Auswahl
  test('T4: Engines available, invalid selection', () => {
    const invalidSelection = { id: 999, name: 'Invalid Engine', description: '', brand: 'Unknown', additionalPrice: 0 };
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: invalidSelection };
      return undefined;
    });

    render(<EngineSelection />);

    expect(screen.getByRole('heading', { name: /engine/i })).toBeInTheDocument(); // Show heading: T
    expect(screen.getAllByRole('listitem')).toHaveLength(mockEngines.length); // Show engine list: T

    // Kein Engine sollte als selected markiert sein, da die Auswahl ungültig ist
    const allListItems = screen.getAllByRole('listitem');
    allListItems.forEach(item => {
      expect(item).not.toHaveClass('selected'); // Highlight selection: F
    });
  });

  // Test für Click-Handler Funktionalität
  test('Click handler works for available engines', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: mockEngines };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);

    const engineToSelect = mockEngines[0];
    const engineElement = getEngineListItem(engineToSelect.name);

    fireEvent.click(engineElement!);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelectedEngine(engineToSelect));
  });
});

describe('EngineSelection - Boundary Value Testing', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockUseAppSelector.mockClear();
  });

  // Grenzwerte für additionalPrice
  test('should handle minimum price boundary (0)', () => {
    const engineWithMinPrice = [{ id: 1, name: 'Min Price Engine', description: 'Test', brand: 'Test', additionalPrice: 0 }];

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: engineWithMinPrice };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);
    expect(screen.getByText('+0 €')).toBeInTheDocument();
  });

  test('should handle very high price boundary', () => {
    const engineWithMaxPrice = [{ id: 1, name: 'Max Price Engine', description: 'Test', brand: 'Test', additionalPrice: 999999 }];

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: engineWithMaxPrice };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);
    expect(screen.getByText('+999,999 €')).toBeInTheDocument();
  });

  // Grenzwerte für Array-Länge
  test('should handle array length boundary (1 element)', () => {
    const singleEngineArray = [mockEngines[0]];

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectConfiguration) return { engines: singleEngineArray };
      if (selector === selectSelectedOptions) return { selectedEngine: null };
      return undefined;
    });

    render(<EngineSelection />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});