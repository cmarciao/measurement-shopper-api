/* eslint-disable @typescript-eslint/no-explicit-any */
export class Registry {
    private static INSTANCE: Registry | null = null;
    dependencies = new Map<string, any>();

    private constructor() {
        /** Do nothing */
    }

    provide(name: string, dependency: any) {
        this.dependencies.set(name, dependency);
    }

    inject(name: string) {
        return this.dependencies.get(name);
    }

    static getInstance() {
        if (!Registry.INSTANCE) {
            Registry.INSTANCE = new Registry();
        }

        return this.INSTANCE!;
    }
}

export function inject(name: string) {
    return (target: any, propertyKey: string) => {
        target[propertyKey] = new Proxy(
            {},
            {
                get(_target: any, propertyKey: string) {
                    const dependency = Registry.getInstance().inject(name);
                    return dependency[propertyKey];
                },
            },
        );
    };
}
