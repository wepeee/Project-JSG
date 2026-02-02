
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Machine
 * 
 */
export type Machine = $Result.DefaultSelection<Prisma.$MachinePayload>
/**
 * Model Material
 * 
 */
export type Material = $Result.DefaultSelection<Prisma.$MaterialPayload>
/**
 * Model Process
 * 
 */
export type Process = $Result.DefaultSelection<Prisma.$ProcessPayload>
/**
 * Model ProSequence
 * 
 */
export type ProSequence = $Result.DefaultSelection<Prisma.$ProSequencePayload>
/**
 * Model Pro
 * 
 */
export type Pro = $Result.DefaultSelection<Prisma.$ProPayload>
/**
 * Model ProStep
 * 
 */
export type ProStep = $Result.DefaultSelection<Prisma.$ProStepPayload>
/**
 * Model ProStepMaterial
 * 
 */
export type ProStepMaterial = $Result.DefaultSelection<Prisma.$ProStepMaterialPayload>
/**
 * Model ProductionReport
 * 
 */
export type ProductionReport = $Result.DefaultSelection<Prisma.$ProductionReportPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  PPIC: 'PPIC',
  OPERATOR: 'OPERATOR',
  MASTER: 'MASTER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Uom: {
  sheet: 'sheet',
  pcs: 'pcs',
  meter: 'meter',
  cm: 'cm'
};

export type Uom = (typeof Uom)[keyof typeof Uom]


export const MachineType: {
  PAPER: 'PAPER',
  RIGID: 'RIGID'
};

export type MachineType = (typeof MachineType)[keyof typeof MachineType]


export const ProStatus: {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

export type ProStatus = (typeof ProStatus)[keyof typeof ProStatus]


export const ProType: {
  PAPER: 'PAPER',
  RIGID: 'RIGID',
  OTHER: 'OTHER'
};

export type ProType = (typeof ProType)[keyof typeof ProType]


export const LphType: {
  PAPER: 'PAPER',
  PRINTING: 'PRINTING',
  PACKING_ASSEMBLY: 'PACKING_ASSEMBLY',
  BLOW_MOULDING: 'BLOW_MOULDING',
  INJECTION: 'INJECTION'
};

export type LphType = (typeof LphType)[keyof typeof LphType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Uom = $Enums.Uom

export const Uom: typeof $Enums.Uom

export type MachineType = $Enums.MachineType

export const MachineType: typeof $Enums.MachineType

export type ProStatus = $Enums.ProStatus

export const ProStatus: typeof $Enums.ProStatus

export type ProType = $Enums.ProType

export const ProType: typeof $Enums.ProType

export type LphType = $Enums.LphType

export const LphType: typeof $Enums.LphType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.machine`: Exposes CRUD operations for the **Machine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Machines
    * const machines = await prisma.machine.findMany()
    * ```
    */
  get machine(): Prisma.MachineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.material`: Exposes CRUD operations for the **Material** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Materials
    * const materials = await prisma.material.findMany()
    * ```
    */
  get material(): Prisma.MaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.process`: Exposes CRUD operations for the **Process** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Processes
    * const processes = await prisma.process.findMany()
    * ```
    */
  get process(): Prisma.ProcessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.proSequence`: Exposes CRUD operations for the **ProSequence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProSequences
    * const proSequences = await prisma.proSequence.findMany()
    * ```
    */
  get proSequence(): Prisma.ProSequenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pro`: Exposes CRUD operations for the **Pro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pros
    * const pros = await prisma.pro.findMany()
    * ```
    */
  get pro(): Prisma.ProDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.proStep`: Exposes CRUD operations for the **ProStep** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProSteps
    * const proSteps = await prisma.proStep.findMany()
    * ```
    */
  get proStep(): Prisma.ProStepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.proStepMaterial`: Exposes CRUD operations for the **ProStepMaterial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProStepMaterials
    * const proStepMaterials = await prisma.proStepMaterial.findMany()
    * ```
    */
  get proStepMaterial(): Prisma.ProStepMaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productionReport`: Exposes CRUD operations for the **ProductionReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductionReports
    * const productionReports = await prisma.productionReport.findMany()
    * ```
    */
  get productionReport(): Prisma.ProductionReportDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Machine: 'Machine',
    Material: 'Material',
    Process: 'Process',
    ProSequence: 'ProSequence',
    Pro: 'Pro',
    ProStep: 'ProStep',
    ProStepMaterial: 'ProStepMaterial',
    ProductionReport: 'ProductionReport'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "machine" | "material" | "process" | "proSequence" | "pro" | "proStep" | "proStepMaterial" | "productionReport"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Machine: {
        payload: Prisma.$MachinePayload<ExtArgs>
        fields: Prisma.MachineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MachineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MachineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          findFirst: {
            args: Prisma.MachineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MachineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          findMany: {
            args: Prisma.MachineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>[]
          }
          create: {
            args: Prisma.MachineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          createMany: {
            args: Prisma.MachineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MachineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          update: {
            args: Prisma.MachineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          deleteMany: {
            args: Prisma.MachineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MachineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MachineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MachinePayload>
          }
          aggregate: {
            args: Prisma.MachineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMachine>
          }
          groupBy: {
            args: Prisma.MachineGroupByArgs<ExtArgs>
            result: $Utils.Optional<MachineGroupByOutputType>[]
          }
          count: {
            args: Prisma.MachineCountArgs<ExtArgs>
            result: $Utils.Optional<MachineCountAggregateOutputType> | number
          }
        }
      }
      Material: {
        payload: Prisma.$MaterialPayload<ExtArgs>
        fields: Prisma.MaterialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaterialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaterialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          findFirst: {
            args: Prisma.MaterialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaterialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          findMany: {
            args: Prisma.MaterialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>[]
          }
          create: {
            args: Prisma.MaterialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          createMany: {
            args: Prisma.MaterialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MaterialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          update: {
            args: Prisma.MaterialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          deleteMany: {
            args: Prisma.MaterialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaterialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MaterialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaterialPayload>
          }
          aggregate: {
            args: Prisma.MaterialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaterial>
          }
          groupBy: {
            args: Prisma.MaterialGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaterialGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaterialCountArgs<ExtArgs>
            result: $Utils.Optional<MaterialCountAggregateOutputType> | number
          }
        }
      }
      Process: {
        payload: Prisma.$ProcessPayload<ExtArgs>
        fields: Prisma.ProcessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          findFirst: {
            args: Prisma.ProcessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          findMany: {
            args: Prisma.ProcessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>[]
          }
          create: {
            args: Prisma.ProcessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          createMany: {
            args: Prisma.ProcessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProcessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          update: {
            args: Prisma.ProcessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          deleteMany: {
            args: Prisma.ProcessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProcessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessPayload>
          }
          aggregate: {
            args: Prisma.ProcessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcess>
          }
          groupBy: {
            args: Prisma.ProcessGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessCountAggregateOutputType> | number
          }
        }
      }
      ProSequence: {
        payload: Prisma.$ProSequencePayload<ExtArgs>
        fields: Prisma.ProSequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProSequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProSequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          findFirst: {
            args: Prisma.ProSequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProSequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          findMany: {
            args: Prisma.ProSequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>[]
          }
          create: {
            args: Prisma.ProSequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          createMany: {
            args: Prisma.ProSequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProSequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          update: {
            args: Prisma.ProSequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          deleteMany: {
            args: Prisma.ProSequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProSequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProSequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProSequencePayload>
          }
          aggregate: {
            args: Prisma.ProSequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProSequence>
          }
          groupBy: {
            args: Prisma.ProSequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProSequenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProSequenceCountArgs<ExtArgs>
            result: $Utils.Optional<ProSequenceCountAggregateOutputType> | number
          }
        }
      }
      Pro: {
        payload: Prisma.$ProPayload<ExtArgs>
        fields: Prisma.ProFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          findFirst: {
            args: Prisma.ProFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          findMany: {
            args: Prisma.ProFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>[]
          }
          create: {
            args: Prisma.ProCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          createMany: {
            args: Prisma.ProCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          update: {
            args: Prisma.ProUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          deleteMany: {
            args: Prisma.ProDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPayload>
          }
          aggregate: {
            args: Prisma.ProAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePro>
          }
          groupBy: {
            args: Prisma.ProGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProCountArgs<ExtArgs>
            result: $Utils.Optional<ProCountAggregateOutputType> | number
          }
        }
      }
      ProStep: {
        payload: Prisma.$ProStepPayload<ExtArgs>
        fields: Prisma.ProStepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProStepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProStepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          findFirst: {
            args: Prisma.ProStepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProStepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          findMany: {
            args: Prisma.ProStepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>[]
          }
          create: {
            args: Prisma.ProStepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          createMany: {
            args: Prisma.ProStepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProStepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          update: {
            args: Prisma.ProStepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          deleteMany: {
            args: Prisma.ProStepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProStepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProStepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepPayload>
          }
          aggregate: {
            args: Prisma.ProStepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProStep>
          }
          groupBy: {
            args: Prisma.ProStepGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProStepGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProStepCountArgs<ExtArgs>
            result: $Utils.Optional<ProStepCountAggregateOutputType> | number
          }
        }
      }
      ProStepMaterial: {
        payload: Prisma.$ProStepMaterialPayload<ExtArgs>
        fields: Prisma.ProStepMaterialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProStepMaterialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProStepMaterialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          findFirst: {
            args: Prisma.ProStepMaterialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProStepMaterialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          findMany: {
            args: Prisma.ProStepMaterialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>[]
          }
          create: {
            args: Prisma.ProStepMaterialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          createMany: {
            args: Prisma.ProStepMaterialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProStepMaterialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          update: {
            args: Prisma.ProStepMaterialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          deleteMany: {
            args: Prisma.ProStepMaterialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProStepMaterialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProStepMaterialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProStepMaterialPayload>
          }
          aggregate: {
            args: Prisma.ProStepMaterialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProStepMaterial>
          }
          groupBy: {
            args: Prisma.ProStepMaterialGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProStepMaterialGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProStepMaterialCountArgs<ExtArgs>
            result: $Utils.Optional<ProStepMaterialCountAggregateOutputType> | number
          }
        }
      }
      ProductionReport: {
        payload: Prisma.$ProductionReportPayload<ExtArgs>
        fields: Prisma.ProductionReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductionReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductionReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          findFirst: {
            args: Prisma.ProductionReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductionReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          findMany: {
            args: Prisma.ProductionReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>[]
          }
          create: {
            args: Prisma.ProductionReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          createMany: {
            args: Prisma.ProductionReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductionReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          update: {
            args: Prisma.ProductionReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          deleteMany: {
            args: Prisma.ProductionReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductionReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductionReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductionReportPayload>
          }
          aggregate: {
            args: Prisma.ProductionReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductionReport>
          }
          groupBy: {
            args: Prisma.ProductionReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductionReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductionReportCountArgs<ExtArgs>
            result: $Utils.Optional<ProductionReportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    machine?: MachineOmit
    material?: MaterialOmit
    process?: ProcessOmit
    proSequence?: ProSequenceOmit
    pro?: ProOmit
    proStep?: ProStepOmit
    proStepMaterial?: ProStepMaterialOmit
    productionReport?: ProductionReportOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MachineCountOutputType
   */

  export type MachineCountOutputType = {
    proSteps: number
  }

  export type MachineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proSteps?: boolean | MachineCountOutputTypeCountProStepsArgs
  }

  // Custom InputTypes
  /**
   * MachineCountOutputType without action
   */
  export type MachineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MachineCountOutputType
     */
    select?: MachineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MachineCountOutputType without action
   */
  export type MachineCountOutputTypeCountProStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepWhereInput
  }


  /**
   * Count Type MaterialCountOutputType
   */

  export type MaterialCountOutputType = {
    proStepMaterials: number
  }

  export type MaterialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proStepMaterials?: boolean | MaterialCountOutputTypeCountProStepMaterialsArgs
  }

  // Custom InputTypes
  /**
   * MaterialCountOutputType without action
   */
  export type MaterialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaterialCountOutputType
     */
    select?: MaterialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MaterialCountOutputType without action
   */
  export type MaterialCountOutputTypeCountProStepMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepMaterialWhereInput
  }


  /**
   * Count Type ProcessCountOutputType
   */

  export type ProcessCountOutputType = {
    pros: number
  }

  export type ProcessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pros?: boolean | ProcessCountOutputTypeCountProsArgs
  }

  // Custom InputTypes
  /**
   * ProcessCountOutputType without action
   */
  export type ProcessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessCountOutputType
     */
    select?: ProcessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProcessCountOutputType without action
   */
  export type ProcessCountOutputTypeCountProsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProWhereInput
  }


  /**
   * Count Type ProCountOutputType
   */

  export type ProCountOutputType = {
    steps: number
  }

  export type ProCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    steps?: boolean | ProCountOutputTypeCountStepsArgs
  }

  // Custom InputTypes
  /**
   * ProCountOutputType without action
   */
  export type ProCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProCountOutputType
     */
    select?: ProCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProCountOutputType without action
   */
  export type ProCountOutputTypeCountStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepWhereInput
  }


  /**
   * Count Type ProStepCountOutputType
   */

  export type ProStepCountOutputType = {
    materials: number
    productionReports: number
  }

  export type ProStepCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materials?: boolean | ProStepCountOutputTypeCountMaterialsArgs
    productionReports?: boolean | ProStepCountOutputTypeCountProductionReportsArgs
  }

  // Custom InputTypes
  /**
   * ProStepCountOutputType without action
   */
  export type ProStepCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepCountOutputType
     */
    select?: ProStepCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProStepCountOutputType without action
   */
  export type ProStepCountOutputTypeCountMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepMaterialWhereInput
  }

  /**
   * ProStepCountOutputType without action
   */
  export type ProStepCountOutputTypeCountProductionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionReportWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    passwordHash: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "passwordHash" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      passwordHash: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Machine
   */

  export type AggregateMachine = {
    _count: MachineCountAggregateOutputType | null
    _avg: MachineAvgAggregateOutputType | null
    _sum: MachineSumAggregateOutputType | null
    _min: MachineMinAggregateOutputType | null
    _max: MachineMaxAggregateOutputType | null
  }

  export type MachineAvgAggregateOutputType = {
    id: number | null
    stdOutputPerHour: number | null
    stdOutputPerShift: number | null
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
  }

  export type MachineSumAggregateOutputType = {
    id: number | null
    stdOutputPerHour: number | null
    stdOutputPerShift: number | null
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
  }

  export type MachineMinAggregateOutputType = {
    id: number | null
    name: string | null
    stdOutputPerHour: number | null
    stdOutputPerShift: number | null
    uom: $Enums.Uom | null
    type: $Enums.MachineType | null
    remark: string | null
    partNumber: string | null
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
    shortDesc: string | null
    phase: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MachineMaxAggregateOutputType = {
    id: number | null
    name: string | null
    stdOutputPerHour: number | null
    stdOutputPerShift: number | null
    uom: $Enums.Uom | null
    type: $Enums.MachineType | null
    remark: string | null
    partNumber: string | null
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
    shortDesc: string | null
    phase: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MachineCountAggregateOutputType = {
    id: number
    name: number
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: number
    type: number
    remark: number
    partNumber: number
    cycleTimeSec: number
    cycleTimeMin: number
    cavity: number
    manPower: number
    stdOutputPerDay: number
    workCenter: number
    shortDesc: number
    phase: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MachineAvgAggregateInputType = {
    id?: true
    stdOutputPerHour?: true
    stdOutputPerShift?: true
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
  }

  export type MachineSumAggregateInputType = {
    id?: true
    stdOutputPerHour?: true
    stdOutputPerShift?: true
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
  }

  export type MachineMinAggregateInputType = {
    id?: true
    name?: true
    stdOutputPerHour?: true
    stdOutputPerShift?: true
    uom?: true
    type?: true
    remark?: true
    partNumber?: true
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
    shortDesc?: true
    phase?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MachineMaxAggregateInputType = {
    id?: true
    name?: true
    stdOutputPerHour?: true
    stdOutputPerShift?: true
    uom?: true
    type?: true
    remark?: true
    partNumber?: true
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
    shortDesc?: true
    phase?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MachineCountAggregateInputType = {
    id?: true
    name?: true
    stdOutputPerHour?: true
    stdOutputPerShift?: true
    uom?: true
    type?: true
    remark?: true
    partNumber?: true
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
    shortDesc?: true
    phase?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MachineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Machine to aggregate.
     */
    where?: MachineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Machines to fetch.
     */
    orderBy?: MachineOrderByWithRelationInput | MachineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MachineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Machines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Machines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Machines
    **/
    _count?: true | MachineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MachineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MachineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MachineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MachineMaxAggregateInputType
  }

  export type GetMachineAggregateType<T extends MachineAggregateArgs> = {
        [P in keyof T & keyof AggregateMachine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMachine[P]>
      : GetScalarType<T[P], AggregateMachine[P]>
  }




  export type MachineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MachineWhereInput
    orderBy?: MachineOrderByWithAggregationInput | MachineOrderByWithAggregationInput[]
    by: MachineScalarFieldEnum[] | MachineScalarFieldEnum
    having?: MachineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MachineCountAggregateInputType | true
    _avg?: MachineAvgAggregateInputType
    _sum?: MachineSumAggregateInputType
    _min?: MachineMinAggregateInputType
    _max?: MachineMaxAggregateInputType
  }

  export type MachineGroupByOutputType = {
    id: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type: $Enums.MachineType
    remark: string | null
    partNumber: string | null
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
    shortDesc: string | null
    phase: string | null
    createdAt: Date
    updatedAt: Date
    _count: MachineCountAggregateOutputType | null
    _avg: MachineAvgAggregateOutputType | null
    _sum: MachineSumAggregateOutputType | null
    _min: MachineMinAggregateOutputType | null
    _max: MachineMaxAggregateOutputType | null
  }

  type GetMachineGroupByPayload<T extends MachineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MachineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MachineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MachineGroupByOutputType[P]>
            : GetScalarType<T[P], MachineGroupByOutputType[P]>
        }
      >
    >


  export type MachineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stdOutputPerHour?: boolean
    stdOutputPerShift?: boolean
    uom?: boolean
    type?: boolean
    remark?: boolean
    partNumber?: boolean
    cycleTimeSec?: boolean
    cycleTimeMin?: boolean
    cavity?: boolean
    manPower?: boolean
    stdOutputPerDay?: boolean
    workCenter?: boolean
    shortDesc?: boolean
    phase?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    proSteps?: boolean | Machine$proStepsArgs<ExtArgs>
    _count?: boolean | MachineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["machine"]>



  export type MachineSelectScalar = {
    id?: boolean
    name?: boolean
    stdOutputPerHour?: boolean
    stdOutputPerShift?: boolean
    uom?: boolean
    type?: boolean
    remark?: boolean
    partNumber?: boolean
    cycleTimeSec?: boolean
    cycleTimeMin?: boolean
    cavity?: boolean
    manPower?: boolean
    stdOutputPerDay?: boolean
    workCenter?: boolean
    shortDesc?: boolean
    phase?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MachineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "stdOutputPerHour" | "stdOutputPerShift" | "uom" | "type" | "remark" | "partNumber" | "cycleTimeSec" | "cycleTimeMin" | "cavity" | "manPower" | "stdOutputPerDay" | "workCenter" | "shortDesc" | "phase" | "createdAt" | "updatedAt", ExtArgs["result"]["machine"]>
  export type MachineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proSteps?: boolean | Machine$proStepsArgs<ExtArgs>
    _count?: boolean | MachineCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MachinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Machine"
    objects: {
      proSteps: Prisma.$ProStepPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      stdOutputPerHour: number
      stdOutputPerShift: number
      uom: $Enums.Uom
      type: $Enums.MachineType
      remark: string | null
      partNumber: string | null
      cycleTimeSec: Prisma.Decimal | null
      cycleTimeMin: Prisma.Decimal | null
      cavity: number | null
      manPower: number | null
      stdOutputPerDay: number | null
      workCenter: string | null
      shortDesc: string | null
      phase: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["machine"]>
    composites: {}
  }

  type MachineGetPayload<S extends boolean | null | undefined | MachineDefaultArgs> = $Result.GetResult<Prisma.$MachinePayload, S>

  type MachineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MachineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MachineCountAggregateInputType | true
    }

  export interface MachineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Machine'], meta: { name: 'Machine' } }
    /**
     * Find zero or one Machine that matches the filter.
     * @param {MachineFindUniqueArgs} args - Arguments to find a Machine
     * @example
     * // Get one Machine
     * const machine = await prisma.machine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MachineFindUniqueArgs>(args: SelectSubset<T, MachineFindUniqueArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Machine that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MachineFindUniqueOrThrowArgs} args - Arguments to find a Machine
     * @example
     * // Get one Machine
     * const machine = await prisma.machine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MachineFindUniqueOrThrowArgs>(args: SelectSubset<T, MachineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Machine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineFindFirstArgs} args - Arguments to find a Machine
     * @example
     * // Get one Machine
     * const machine = await prisma.machine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MachineFindFirstArgs>(args?: SelectSubset<T, MachineFindFirstArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Machine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineFindFirstOrThrowArgs} args - Arguments to find a Machine
     * @example
     * // Get one Machine
     * const machine = await prisma.machine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MachineFindFirstOrThrowArgs>(args?: SelectSubset<T, MachineFindFirstOrThrowArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Machines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Machines
     * const machines = await prisma.machine.findMany()
     * 
     * // Get first 10 Machines
     * const machines = await prisma.machine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const machineWithIdOnly = await prisma.machine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MachineFindManyArgs>(args?: SelectSubset<T, MachineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Machine.
     * @param {MachineCreateArgs} args - Arguments to create a Machine.
     * @example
     * // Create one Machine
     * const Machine = await prisma.machine.create({
     *   data: {
     *     // ... data to create a Machine
     *   }
     * })
     * 
     */
    create<T extends MachineCreateArgs>(args: SelectSubset<T, MachineCreateArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Machines.
     * @param {MachineCreateManyArgs} args - Arguments to create many Machines.
     * @example
     * // Create many Machines
     * const machine = await prisma.machine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MachineCreateManyArgs>(args?: SelectSubset<T, MachineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Machine.
     * @param {MachineDeleteArgs} args - Arguments to delete one Machine.
     * @example
     * // Delete one Machine
     * const Machine = await prisma.machine.delete({
     *   where: {
     *     // ... filter to delete one Machine
     *   }
     * })
     * 
     */
    delete<T extends MachineDeleteArgs>(args: SelectSubset<T, MachineDeleteArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Machine.
     * @param {MachineUpdateArgs} args - Arguments to update one Machine.
     * @example
     * // Update one Machine
     * const machine = await prisma.machine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MachineUpdateArgs>(args: SelectSubset<T, MachineUpdateArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Machines.
     * @param {MachineDeleteManyArgs} args - Arguments to filter Machines to delete.
     * @example
     * // Delete a few Machines
     * const { count } = await prisma.machine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MachineDeleteManyArgs>(args?: SelectSubset<T, MachineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Machines
     * const machine = await prisma.machine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MachineUpdateManyArgs>(args: SelectSubset<T, MachineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Machine.
     * @param {MachineUpsertArgs} args - Arguments to update or create a Machine.
     * @example
     * // Update or create a Machine
     * const machine = await prisma.machine.upsert({
     *   create: {
     *     // ... data to create a Machine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Machine we want to update
     *   }
     * })
     */
    upsert<T extends MachineUpsertArgs>(args: SelectSubset<T, MachineUpsertArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineCountArgs} args - Arguments to filter Machines to count.
     * @example
     * // Count the number of Machines
     * const count = await prisma.machine.count({
     *   where: {
     *     // ... the filter for the Machines we want to count
     *   }
     * })
    **/
    count<T extends MachineCountArgs>(
      args?: Subset<T, MachineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MachineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Machine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MachineAggregateArgs>(args: Subset<T, MachineAggregateArgs>): Prisma.PrismaPromise<GetMachineAggregateType<T>>

    /**
     * Group by Machine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MachineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MachineGroupByArgs['orderBy'] }
        : { orderBy?: MachineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MachineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMachineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Machine model
   */
  readonly fields: MachineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Machine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MachineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    proSteps<T extends Machine$proStepsArgs<ExtArgs> = {}>(args?: Subset<T, Machine$proStepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Machine model
   */
  interface MachineFieldRefs {
    readonly id: FieldRef<"Machine", 'Int'>
    readonly name: FieldRef<"Machine", 'String'>
    readonly stdOutputPerHour: FieldRef<"Machine", 'Int'>
    readonly stdOutputPerShift: FieldRef<"Machine", 'Int'>
    readonly uom: FieldRef<"Machine", 'Uom'>
    readonly type: FieldRef<"Machine", 'MachineType'>
    readonly remark: FieldRef<"Machine", 'String'>
    readonly partNumber: FieldRef<"Machine", 'String'>
    readonly cycleTimeSec: FieldRef<"Machine", 'Decimal'>
    readonly cycleTimeMin: FieldRef<"Machine", 'Decimal'>
    readonly cavity: FieldRef<"Machine", 'Int'>
    readonly manPower: FieldRef<"Machine", 'Int'>
    readonly stdOutputPerDay: FieldRef<"Machine", 'Int'>
    readonly workCenter: FieldRef<"Machine", 'String'>
    readonly shortDesc: FieldRef<"Machine", 'String'>
    readonly phase: FieldRef<"Machine", 'String'>
    readonly createdAt: FieldRef<"Machine", 'DateTime'>
    readonly updatedAt: FieldRef<"Machine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Machine findUnique
   */
  export type MachineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter, which Machine to fetch.
     */
    where: MachineWhereUniqueInput
  }

  /**
   * Machine findUniqueOrThrow
   */
  export type MachineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter, which Machine to fetch.
     */
    where: MachineWhereUniqueInput
  }

  /**
   * Machine findFirst
   */
  export type MachineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter, which Machine to fetch.
     */
    where?: MachineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Machines to fetch.
     */
    orderBy?: MachineOrderByWithRelationInput | MachineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Machines.
     */
    cursor?: MachineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Machines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Machines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Machines.
     */
    distinct?: MachineScalarFieldEnum | MachineScalarFieldEnum[]
  }

  /**
   * Machine findFirstOrThrow
   */
  export type MachineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter, which Machine to fetch.
     */
    where?: MachineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Machines to fetch.
     */
    orderBy?: MachineOrderByWithRelationInput | MachineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Machines.
     */
    cursor?: MachineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Machines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Machines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Machines.
     */
    distinct?: MachineScalarFieldEnum | MachineScalarFieldEnum[]
  }

  /**
   * Machine findMany
   */
  export type MachineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter, which Machines to fetch.
     */
    where?: MachineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Machines to fetch.
     */
    orderBy?: MachineOrderByWithRelationInput | MachineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Machines.
     */
    cursor?: MachineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Machines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Machines.
     */
    skip?: number
    distinct?: MachineScalarFieldEnum | MachineScalarFieldEnum[]
  }

  /**
   * Machine create
   */
  export type MachineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * The data needed to create a Machine.
     */
    data: XOR<MachineCreateInput, MachineUncheckedCreateInput>
  }

  /**
   * Machine createMany
   */
  export type MachineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Machines.
     */
    data: MachineCreateManyInput | MachineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Machine update
   */
  export type MachineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * The data needed to update a Machine.
     */
    data: XOR<MachineUpdateInput, MachineUncheckedUpdateInput>
    /**
     * Choose, which Machine to update.
     */
    where: MachineWhereUniqueInput
  }

  /**
   * Machine updateMany
   */
  export type MachineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Machines.
     */
    data: XOR<MachineUpdateManyMutationInput, MachineUncheckedUpdateManyInput>
    /**
     * Filter which Machines to update
     */
    where?: MachineWhereInput
    /**
     * Limit how many Machines to update.
     */
    limit?: number
  }

  /**
   * Machine upsert
   */
  export type MachineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * The filter to search for the Machine to update in case it exists.
     */
    where: MachineWhereUniqueInput
    /**
     * In case the Machine found by the `where` argument doesn't exist, create a new Machine with this data.
     */
    create: XOR<MachineCreateInput, MachineUncheckedCreateInput>
    /**
     * In case the Machine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MachineUpdateInput, MachineUncheckedUpdateInput>
  }

  /**
   * Machine delete
   */
  export type MachineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    /**
     * Filter which Machine to delete.
     */
    where: MachineWhereUniqueInput
  }

  /**
   * Machine deleteMany
   */
  export type MachineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Machines to delete
     */
    where?: MachineWhereInput
    /**
     * Limit how many Machines to delete.
     */
    limit?: number
  }

  /**
   * Machine.proSteps
   */
  export type Machine$proStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    where?: ProStepWhereInput
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    cursor?: ProStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProStepScalarFieldEnum | ProStepScalarFieldEnum[]
  }

  /**
   * Machine without action
   */
  export type MachineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
  }


  /**
   * Model Material
   */

  export type AggregateMaterial = {
    _count: MaterialCountAggregateOutputType | null
    _avg: MaterialAvgAggregateOutputType | null
    _sum: MaterialSumAggregateOutputType | null
    _min: MaterialMinAggregateOutputType | null
    _max: MaterialMaxAggregateOutputType | null
  }

  export type MaterialAvgAggregateOutputType = {
    id: number | null
  }

  export type MaterialSumAggregateOutputType = {
    id: number | null
  }

  export type MaterialMinAggregateOutputType = {
    id: number | null
    name: string | null
    uom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaterialMaxAggregateOutputType = {
    id: number | null
    name: string | null
    uom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaterialCountAggregateOutputType = {
    id: number
    name: number
    uom: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MaterialAvgAggregateInputType = {
    id?: true
  }

  export type MaterialSumAggregateInputType = {
    id?: true
  }

  export type MaterialMinAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaterialMaxAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaterialCountAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MaterialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Material to aggregate.
     */
    where?: MaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materials to fetch.
     */
    orderBy?: MaterialOrderByWithRelationInput | MaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Materials
    **/
    _count?: true | MaterialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaterialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaterialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaterialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaterialMaxAggregateInputType
  }

  export type GetMaterialAggregateType<T extends MaterialAggregateArgs> = {
        [P in keyof T & keyof AggregateMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaterial[P]>
      : GetScalarType<T[P], AggregateMaterial[P]>
  }




  export type MaterialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaterialWhereInput
    orderBy?: MaterialOrderByWithAggregationInput | MaterialOrderByWithAggregationInput[]
    by: MaterialScalarFieldEnum[] | MaterialScalarFieldEnum
    having?: MaterialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaterialCountAggregateInputType | true
    _avg?: MaterialAvgAggregateInputType
    _sum?: MaterialSumAggregateInputType
    _min?: MaterialMinAggregateInputType
    _max?: MaterialMaxAggregateInputType
  }

  export type MaterialGroupByOutputType = {
    id: number
    name: string
    uom: string
    createdAt: Date
    updatedAt: Date
    _count: MaterialCountAggregateOutputType | null
    _avg: MaterialAvgAggregateOutputType | null
    _sum: MaterialSumAggregateOutputType | null
    _min: MaterialMinAggregateOutputType | null
    _max: MaterialMaxAggregateOutputType | null
  }

  type GetMaterialGroupByPayload<T extends MaterialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaterialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaterialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaterialGroupByOutputType[P]>
            : GetScalarType<T[P], MaterialGroupByOutputType[P]>
        }
      >
    >


  export type MaterialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    uom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    proStepMaterials?: boolean | Material$proStepMaterialsArgs<ExtArgs>
    _count?: boolean | MaterialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["material"]>



  export type MaterialSelectScalar = {
    id?: boolean
    name?: boolean
    uom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "uom" | "createdAt" | "updatedAt", ExtArgs["result"]["material"]>
  export type MaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proStepMaterials?: boolean | Material$proStepMaterialsArgs<ExtArgs>
    _count?: boolean | MaterialCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Material"
    objects: {
      proStepMaterials: Prisma.$ProStepMaterialPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      uom: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["material"]>
    composites: {}
  }

  type MaterialGetPayload<S extends boolean | null | undefined | MaterialDefaultArgs> = $Result.GetResult<Prisma.$MaterialPayload, S>

  type MaterialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaterialCountAggregateInputType | true
    }

  export interface MaterialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Material'], meta: { name: 'Material' } }
    /**
     * Find zero or one Material that matches the filter.
     * @param {MaterialFindUniqueArgs} args - Arguments to find a Material
     * @example
     * // Get one Material
     * const material = await prisma.material.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaterialFindUniqueArgs>(args: SelectSubset<T, MaterialFindUniqueArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Material that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaterialFindUniqueOrThrowArgs} args - Arguments to find a Material
     * @example
     * // Get one Material
     * const material = await prisma.material.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaterialFindUniqueOrThrowArgs>(args: SelectSubset<T, MaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Material that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialFindFirstArgs} args - Arguments to find a Material
     * @example
     * // Get one Material
     * const material = await prisma.material.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaterialFindFirstArgs>(args?: SelectSubset<T, MaterialFindFirstArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Material that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialFindFirstOrThrowArgs} args - Arguments to find a Material
     * @example
     * // Get one Material
     * const material = await prisma.material.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaterialFindFirstOrThrowArgs>(args?: SelectSubset<T, MaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Materials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Materials
     * const materials = await prisma.material.findMany()
     * 
     * // Get first 10 Materials
     * const materials = await prisma.material.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const materialWithIdOnly = await prisma.material.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaterialFindManyArgs>(args?: SelectSubset<T, MaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Material.
     * @param {MaterialCreateArgs} args - Arguments to create a Material.
     * @example
     * // Create one Material
     * const Material = await prisma.material.create({
     *   data: {
     *     // ... data to create a Material
     *   }
     * })
     * 
     */
    create<T extends MaterialCreateArgs>(args: SelectSubset<T, MaterialCreateArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Materials.
     * @param {MaterialCreateManyArgs} args - Arguments to create many Materials.
     * @example
     * // Create many Materials
     * const material = await prisma.material.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaterialCreateManyArgs>(args?: SelectSubset<T, MaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Material.
     * @param {MaterialDeleteArgs} args - Arguments to delete one Material.
     * @example
     * // Delete one Material
     * const Material = await prisma.material.delete({
     *   where: {
     *     // ... filter to delete one Material
     *   }
     * })
     * 
     */
    delete<T extends MaterialDeleteArgs>(args: SelectSubset<T, MaterialDeleteArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Material.
     * @param {MaterialUpdateArgs} args - Arguments to update one Material.
     * @example
     * // Update one Material
     * const material = await prisma.material.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaterialUpdateArgs>(args: SelectSubset<T, MaterialUpdateArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Materials.
     * @param {MaterialDeleteManyArgs} args - Arguments to filter Materials to delete.
     * @example
     * // Delete a few Materials
     * const { count } = await prisma.material.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaterialDeleteManyArgs>(args?: SelectSubset<T, MaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Materials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Materials
     * const material = await prisma.material.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaterialUpdateManyArgs>(args: SelectSubset<T, MaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Material.
     * @param {MaterialUpsertArgs} args - Arguments to update or create a Material.
     * @example
     * // Update or create a Material
     * const material = await prisma.material.upsert({
     *   create: {
     *     // ... data to create a Material
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Material we want to update
     *   }
     * })
     */
    upsert<T extends MaterialUpsertArgs>(args: SelectSubset<T, MaterialUpsertArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Materials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialCountArgs} args - Arguments to filter Materials to count.
     * @example
     * // Count the number of Materials
     * const count = await prisma.material.count({
     *   where: {
     *     // ... the filter for the Materials we want to count
     *   }
     * })
    **/
    count<T extends MaterialCountArgs>(
      args?: Subset<T, MaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaterialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Material.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaterialAggregateArgs>(args: Subset<T, MaterialAggregateArgs>): Prisma.PrismaPromise<GetMaterialAggregateType<T>>

    /**
     * Group by Material.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaterialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaterialGroupByArgs['orderBy'] }
        : { orderBy?: MaterialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Material model
   */
  readonly fields: MaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Material.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaterialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    proStepMaterials<T extends Material$proStepMaterialsArgs<ExtArgs> = {}>(args?: Subset<T, Material$proStepMaterialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Material model
   */
  interface MaterialFieldRefs {
    readonly id: FieldRef<"Material", 'Int'>
    readonly name: FieldRef<"Material", 'String'>
    readonly uom: FieldRef<"Material", 'String'>
    readonly createdAt: FieldRef<"Material", 'DateTime'>
    readonly updatedAt: FieldRef<"Material", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Material findUnique
   */
  export type MaterialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter, which Material to fetch.
     */
    where: MaterialWhereUniqueInput
  }

  /**
   * Material findUniqueOrThrow
   */
  export type MaterialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter, which Material to fetch.
     */
    where: MaterialWhereUniqueInput
  }

  /**
   * Material findFirst
   */
  export type MaterialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter, which Material to fetch.
     */
    where?: MaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materials to fetch.
     */
    orderBy?: MaterialOrderByWithRelationInput | MaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Materials.
     */
    cursor?: MaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Materials.
     */
    distinct?: MaterialScalarFieldEnum | MaterialScalarFieldEnum[]
  }

  /**
   * Material findFirstOrThrow
   */
  export type MaterialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter, which Material to fetch.
     */
    where?: MaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materials to fetch.
     */
    orderBy?: MaterialOrderByWithRelationInput | MaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Materials.
     */
    cursor?: MaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Materials.
     */
    distinct?: MaterialScalarFieldEnum | MaterialScalarFieldEnum[]
  }

  /**
   * Material findMany
   */
  export type MaterialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter, which Materials to fetch.
     */
    where?: MaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Materials to fetch.
     */
    orderBy?: MaterialOrderByWithRelationInput | MaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Materials.
     */
    cursor?: MaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Materials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Materials.
     */
    skip?: number
    distinct?: MaterialScalarFieldEnum | MaterialScalarFieldEnum[]
  }

  /**
   * Material create
   */
  export type MaterialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * The data needed to create a Material.
     */
    data: XOR<MaterialCreateInput, MaterialUncheckedCreateInput>
  }

  /**
   * Material createMany
   */
  export type MaterialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Materials.
     */
    data: MaterialCreateManyInput | MaterialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Material update
   */
  export type MaterialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * The data needed to update a Material.
     */
    data: XOR<MaterialUpdateInput, MaterialUncheckedUpdateInput>
    /**
     * Choose, which Material to update.
     */
    where: MaterialWhereUniqueInput
  }

  /**
   * Material updateMany
   */
  export type MaterialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Materials.
     */
    data: XOR<MaterialUpdateManyMutationInput, MaterialUncheckedUpdateManyInput>
    /**
     * Filter which Materials to update
     */
    where?: MaterialWhereInput
    /**
     * Limit how many Materials to update.
     */
    limit?: number
  }

  /**
   * Material upsert
   */
  export type MaterialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * The filter to search for the Material to update in case it exists.
     */
    where: MaterialWhereUniqueInput
    /**
     * In case the Material found by the `where` argument doesn't exist, create a new Material with this data.
     */
    create: XOR<MaterialCreateInput, MaterialUncheckedCreateInput>
    /**
     * In case the Material was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaterialUpdateInput, MaterialUncheckedUpdateInput>
  }

  /**
   * Material delete
   */
  export type MaterialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
    /**
     * Filter which Material to delete.
     */
    where: MaterialWhereUniqueInput
  }

  /**
   * Material deleteMany
   */
  export type MaterialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Materials to delete
     */
    where?: MaterialWhereInput
    /**
     * Limit how many Materials to delete.
     */
    limit?: number
  }

  /**
   * Material.proStepMaterials
   */
  export type Material$proStepMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    where?: ProStepMaterialWhereInput
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    cursor?: ProStepMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProStepMaterialScalarFieldEnum | ProStepMaterialScalarFieldEnum[]
  }

  /**
   * Material without action
   */
  export type MaterialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Material
     */
    select?: MaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Material
     */
    omit?: MaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaterialInclude<ExtArgs> | null
  }


  /**
   * Model Process
   */

  export type AggregateProcess = {
    _count: ProcessCountAggregateOutputType | null
    _avg: ProcessAvgAggregateOutputType | null
    _sum: ProcessSumAggregateOutputType | null
    _min: ProcessMinAggregateOutputType | null
    _max: ProcessMaxAggregateOutputType | null
  }

  export type ProcessAvgAggregateOutputType = {
    id: number | null
  }

  export type ProcessSumAggregateOutputType = {
    id: number | null
  }

  export type ProcessMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.ProType | null
  }

  export type ProcessMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.ProType | null
  }

  export type ProcessCountAggregateOutputType = {
    id: number
    code: number
    name: number
    type: number
    _all: number
  }


  export type ProcessAvgAggregateInputType = {
    id?: true
  }

  export type ProcessSumAggregateInputType = {
    id?: true
  }

  export type ProcessMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
  }

  export type ProcessMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
  }

  export type ProcessCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
    _all?: true
  }

  export type ProcessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Process to aggregate.
     */
    where?: ProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Processes to fetch.
     */
    orderBy?: ProcessOrderByWithRelationInput | ProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Processes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Processes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Processes
    **/
    _count?: true | ProcessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProcessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProcessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessMaxAggregateInputType
  }

  export type GetProcessAggregateType<T extends ProcessAggregateArgs> = {
        [P in keyof T & keyof AggregateProcess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcess[P]>
      : GetScalarType<T[P], AggregateProcess[P]>
  }




  export type ProcessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessWhereInput
    orderBy?: ProcessOrderByWithAggregationInput | ProcessOrderByWithAggregationInput[]
    by: ProcessScalarFieldEnum[] | ProcessScalarFieldEnum
    having?: ProcessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessCountAggregateInputType | true
    _avg?: ProcessAvgAggregateInputType
    _sum?: ProcessSumAggregateInputType
    _min?: ProcessMinAggregateInputType
    _max?: ProcessMaxAggregateInputType
  }

  export type ProcessGroupByOutputType = {
    id: number
    code: string
    name: string
    type: $Enums.ProType
    _count: ProcessCountAggregateOutputType | null
    _avg: ProcessAvgAggregateOutputType | null
    _sum: ProcessSumAggregateOutputType | null
    _min: ProcessMinAggregateOutputType | null
    _max: ProcessMaxAggregateOutputType | null
  }

  type GetProcessGroupByPayload<T extends ProcessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessGroupByOutputType[P]>
        }
      >
    >


  export type ProcessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    pros?: boolean | Process$prosArgs<ExtArgs>
    _count?: boolean | ProcessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["process"]>



  export type ProcessSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
  }

  export type ProcessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "type", ExtArgs["result"]["process"]>
  export type ProcessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pros?: boolean | Process$prosArgs<ExtArgs>
    _count?: boolean | ProcessCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProcessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Process"
    objects: {
      pros: Prisma.$ProPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      type: $Enums.ProType
    }, ExtArgs["result"]["process"]>
    composites: {}
  }

  type ProcessGetPayload<S extends boolean | null | undefined | ProcessDefaultArgs> = $Result.GetResult<Prisma.$ProcessPayload, S>

  type ProcessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProcessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProcessCountAggregateInputType | true
    }

  export interface ProcessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Process'], meta: { name: 'Process' } }
    /**
     * Find zero or one Process that matches the filter.
     * @param {ProcessFindUniqueArgs} args - Arguments to find a Process
     * @example
     * // Get one Process
     * const process = await prisma.process.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessFindUniqueArgs>(args: SelectSubset<T, ProcessFindUniqueArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Process that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessFindUniqueOrThrowArgs} args - Arguments to find a Process
     * @example
     * // Get one Process
     * const process = await prisma.process.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Process that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessFindFirstArgs} args - Arguments to find a Process
     * @example
     * // Get one Process
     * const process = await prisma.process.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessFindFirstArgs>(args?: SelectSubset<T, ProcessFindFirstArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Process that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessFindFirstOrThrowArgs} args - Arguments to find a Process
     * @example
     * // Get one Process
     * const process = await prisma.process.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Processes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Processes
     * const processes = await prisma.process.findMany()
     * 
     * // Get first 10 Processes
     * const processes = await prisma.process.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const processWithIdOnly = await prisma.process.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcessFindManyArgs>(args?: SelectSubset<T, ProcessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Process.
     * @param {ProcessCreateArgs} args - Arguments to create a Process.
     * @example
     * // Create one Process
     * const Process = await prisma.process.create({
     *   data: {
     *     // ... data to create a Process
     *   }
     * })
     * 
     */
    create<T extends ProcessCreateArgs>(args: SelectSubset<T, ProcessCreateArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Processes.
     * @param {ProcessCreateManyArgs} args - Arguments to create many Processes.
     * @example
     * // Create many Processes
     * const process = await prisma.process.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessCreateManyArgs>(args?: SelectSubset<T, ProcessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Process.
     * @param {ProcessDeleteArgs} args - Arguments to delete one Process.
     * @example
     * // Delete one Process
     * const Process = await prisma.process.delete({
     *   where: {
     *     // ... filter to delete one Process
     *   }
     * })
     * 
     */
    delete<T extends ProcessDeleteArgs>(args: SelectSubset<T, ProcessDeleteArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Process.
     * @param {ProcessUpdateArgs} args - Arguments to update one Process.
     * @example
     * // Update one Process
     * const process = await prisma.process.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessUpdateArgs>(args: SelectSubset<T, ProcessUpdateArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Processes.
     * @param {ProcessDeleteManyArgs} args - Arguments to filter Processes to delete.
     * @example
     * // Delete a few Processes
     * const { count } = await prisma.process.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessDeleteManyArgs>(args?: SelectSubset<T, ProcessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Processes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Processes
     * const process = await prisma.process.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessUpdateManyArgs>(args: SelectSubset<T, ProcessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Process.
     * @param {ProcessUpsertArgs} args - Arguments to update or create a Process.
     * @example
     * // Update or create a Process
     * const process = await prisma.process.upsert({
     *   create: {
     *     // ... data to create a Process
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Process we want to update
     *   }
     * })
     */
    upsert<T extends ProcessUpsertArgs>(args: SelectSubset<T, ProcessUpsertArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Processes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessCountArgs} args - Arguments to filter Processes to count.
     * @example
     * // Count the number of Processes
     * const count = await prisma.process.count({
     *   where: {
     *     // ... the filter for the Processes we want to count
     *   }
     * })
    **/
    count<T extends ProcessCountArgs>(
      args?: Subset<T, ProcessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Process.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessAggregateArgs>(args: Subset<T, ProcessAggregateArgs>): Prisma.PrismaPromise<GetProcessAggregateType<T>>

    /**
     * Group by Process.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessGroupByArgs['orderBy'] }
        : { orderBy?: ProcessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Process model
   */
  readonly fields: ProcessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Process.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pros<T extends Process$prosArgs<ExtArgs> = {}>(args?: Subset<T, Process$prosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Process model
   */
  interface ProcessFieldRefs {
    readonly id: FieldRef<"Process", 'Int'>
    readonly code: FieldRef<"Process", 'String'>
    readonly name: FieldRef<"Process", 'String'>
    readonly type: FieldRef<"Process", 'ProType'>
  }
    

  // Custom InputTypes
  /**
   * Process findUnique
   */
  export type ProcessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter, which Process to fetch.
     */
    where: ProcessWhereUniqueInput
  }

  /**
   * Process findUniqueOrThrow
   */
  export type ProcessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter, which Process to fetch.
     */
    where: ProcessWhereUniqueInput
  }

  /**
   * Process findFirst
   */
  export type ProcessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter, which Process to fetch.
     */
    where?: ProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Processes to fetch.
     */
    orderBy?: ProcessOrderByWithRelationInput | ProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Processes.
     */
    cursor?: ProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Processes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Processes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Processes.
     */
    distinct?: ProcessScalarFieldEnum | ProcessScalarFieldEnum[]
  }

  /**
   * Process findFirstOrThrow
   */
  export type ProcessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter, which Process to fetch.
     */
    where?: ProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Processes to fetch.
     */
    orderBy?: ProcessOrderByWithRelationInput | ProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Processes.
     */
    cursor?: ProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Processes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Processes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Processes.
     */
    distinct?: ProcessScalarFieldEnum | ProcessScalarFieldEnum[]
  }

  /**
   * Process findMany
   */
  export type ProcessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter, which Processes to fetch.
     */
    where?: ProcessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Processes to fetch.
     */
    orderBy?: ProcessOrderByWithRelationInput | ProcessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Processes.
     */
    cursor?: ProcessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Processes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Processes.
     */
    skip?: number
    distinct?: ProcessScalarFieldEnum | ProcessScalarFieldEnum[]
  }

  /**
   * Process create
   */
  export type ProcessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * The data needed to create a Process.
     */
    data: XOR<ProcessCreateInput, ProcessUncheckedCreateInput>
  }

  /**
   * Process createMany
   */
  export type ProcessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Processes.
     */
    data: ProcessCreateManyInput | ProcessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Process update
   */
  export type ProcessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * The data needed to update a Process.
     */
    data: XOR<ProcessUpdateInput, ProcessUncheckedUpdateInput>
    /**
     * Choose, which Process to update.
     */
    where: ProcessWhereUniqueInput
  }

  /**
   * Process updateMany
   */
  export type ProcessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Processes.
     */
    data: XOR<ProcessUpdateManyMutationInput, ProcessUncheckedUpdateManyInput>
    /**
     * Filter which Processes to update
     */
    where?: ProcessWhereInput
    /**
     * Limit how many Processes to update.
     */
    limit?: number
  }

  /**
   * Process upsert
   */
  export type ProcessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * The filter to search for the Process to update in case it exists.
     */
    where: ProcessWhereUniqueInput
    /**
     * In case the Process found by the `where` argument doesn't exist, create a new Process with this data.
     */
    create: XOR<ProcessCreateInput, ProcessUncheckedCreateInput>
    /**
     * In case the Process was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessUpdateInput, ProcessUncheckedUpdateInput>
  }

  /**
   * Process delete
   */
  export type ProcessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    /**
     * Filter which Process to delete.
     */
    where: ProcessWhereUniqueInput
  }

  /**
   * Process deleteMany
   */
  export type ProcessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Processes to delete
     */
    where?: ProcessWhereInput
    /**
     * Limit how many Processes to delete.
     */
    limit?: number
  }

  /**
   * Process.pros
   */
  export type Process$prosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    where?: ProWhereInput
    orderBy?: ProOrderByWithRelationInput | ProOrderByWithRelationInput[]
    cursor?: ProWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProScalarFieldEnum | ProScalarFieldEnum[]
  }

  /**
   * Process without action
   */
  export type ProcessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
  }


  /**
   * Model ProSequence
   */

  export type AggregateProSequence = {
    _count: ProSequenceCountAggregateOutputType | null
    _avg: ProSequenceAvgAggregateOutputType | null
    _sum: ProSequenceSumAggregateOutputType | null
    _min: ProSequenceMinAggregateOutputType | null
    _max: ProSequenceMaxAggregateOutputType | null
  }

  export type ProSequenceAvgAggregateOutputType = {
    last: number | null
  }

  export type ProSequenceSumAggregateOutputType = {
    last: number | null
  }

  export type ProSequenceMinAggregateOutputType = {
    prefix: string | null
    last: number | null
  }

  export type ProSequenceMaxAggregateOutputType = {
    prefix: string | null
    last: number | null
  }

  export type ProSequenceCountAggregateOutputType = {
    prefix: number
    last: number
    _all: number
  }


  export type ProSequenceAvgAggregateInputType = {
    last?: true
  }

  export type ProSequenceSumAggregateInputType = {
    last?: true
  }

  export type ProSequenceMinAggregateInputType = {
    prefix?: true
    last?: true
  }

  export type ProSequenceMaxAggregateInputType = {
    prefix?: true
    last?: true
  }

  export type ProSequenceCountAggregateInputType = {
    prefix?: true
    last?: true
    _all?: true
  }

  export type ProSequenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProSequence to aggregate.
     */
    where?: ProSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSequences to fetch.
     */
    orderBy?: ProSequenceOrderByWithRelationInput | ProSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProSequences
    **/
    _count?: true | ProSequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProSequenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProSequenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProSequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProSequenceMaxAggregateInputType
  }

  export type GetProSequenceAggregateType<T extends ProSequenceAggregateArgs> = {
        [P in keyof T & keyof AggregateProSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProSequence[P]>
      : GetScalarType<T[P], AggregateProSequence[P]>
  }




  export type ProSequenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProSequenceWhereInput
    orderBy?: ProSequenceOrderByWithAggregationInput | ProSequenceOrderByWithAggregationInput[]
    by: ProSequenceScalarFieldEnum[] | ProSequenceScalarFieldEnum
    having?: ProSequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProSequenceCountAggregateInputType | true
    _avg?: ProSequenceAvgAggregateInputType
    _sum?: ProSequenceSumAggregateInputType
    _min?: ProSequenceMinAggregateInputType
    _max?: ProSequenceMaxAggregateInputType
  }

  export type ProSequenceGroupByOutputType = {
    prefix: string
    last: number
    _count: ProSequenceCountAggregateOutputType | null
    _avg: ProSequenceAvgAggregateOutputType | null
    _sum: ProSequenceSumAggregateOutputType | null
    _min: ProSequenceMinAggregateOutputType | null
    _max: ProSequenceMaxAggregateOutputType | null
  }

  type GetProSequenceGroupByPayload<T extends ProSequenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProSequenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProSequenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProSequenceGroupByOutputType[P]>
            : GetScalarType<T[P], ProSequenceGroupByOutputType[P]>
        }
      >
    >


  export type ProSequenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    prefix?: boolean
    last?: boolean
  }, ExtArgs["result"]["proSequence"]>



  export type ProSequenceSelectScalar = {
    prefix?: boolean
    last?: boolean
  }

  export type ProSequenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"prefix" | "last", ExtArgs["result"]["proSequence"]>

  export type $ProSequencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProSequence"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      prefix: string
      last: number
    }, ExtArgs["result"]["proSequence"]>
    composites: {}
  }

  type ProSequenceGetPayload<S extends boolean | null | undefined | ProSequenceDefaultArgs> = $Result.GetResult<Prisma.$ProSequencePayload, S>

  type ProSequenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProSequenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProSequenceCountAggregateInputType | true
    }

  export interface ProSequenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProSequence'], meta: { name: 'ProSequence' } }
    /**
     * Find zero or one ProSequence that matches the filter.
     * @param {ProSequenceFindUniqueArgs} args - Arguments to find a ProSequence
     * @example
     * // Get one ProSequence
     * const proSequence = await prisma.proSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProSequenceFindUniqueArgs>(args: SelectSubset<T, ProSequenceFindUniqueArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProSequence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProSequenceFindUniqueOrThrowArgs} args - Arguments to find a ProSequence
     * @example
     * // Get one ProSequence
     * const proSequence = await prisma.proSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProSequenceFindUniqueOrThrowArgs>(args: SelectSubset<T, ProSequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceFindFirstArgs} args - Arguments to find a ProSequence
     * @example
     * // Get one ProSequence
     * const proSequence = await prisma.proSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProSequenceFindFirstArgs>(args?: SelectSubset<T, ProSequenceFindFirstArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceFindFirstOrThrowArgs} args - Arguments to find a ProSequence
     * @example
     * // Get one ProSequence
     * const proSequence = await prisma.proSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProSequenceFindFirstOrThrowArgs>(args?: SelectSubset<T, ProSequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProSequences
     * const proSequences = await prisma.proSequence.findMany()
     * 
     * // Get first 10 ProSequences
     * const proSequences = await prisma.proSequence.findMany({ take: 10 })
     * 
     * // Only select the `prefix`
     * const proSequenceWithPrefixOnly = await prisma.proSequence.findMany({ select: { prefix: true } })
     * 
     */
    findMany<T extends ProSequenceFindManyArgs>(args?: SelectSubset<T, ProSequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProSequence.
     * @param {ProSequenceCreateArgs} args - Arguments to create a ProSequence.
     * @example
     * // Create one ProSequence
     * const ProSequence = await prisma.proSequence.create({
     *   data: {
     *     // ... data to create a ProSequence
     *   }
     * })
     * 
     */
    create<T extends ProSequenceCreateArgs>(args: SelectSubset<T, ProSequenceCreateArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProSequences.
     * @param {ProSequenceCreateManyArgs} args - Arguments to create many ProSequences.
     * @example
     * // Create many ProSequences
     * const proSequence = await prisma.proSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProSequenceCreateManyArgs>(args?: SelectSubset<T, ProSequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProSequence.
     * @param {ProSequenceDeleteArgs} args - Arguments to delete one ProSequence.
     * @example
     * // Delete one ProSequence
     * const ProSequence = await prisma.proSequence.delete({
     *   where: {
     *     // ... filter to delete one ProSequence
     *   }
     * })
     * 
     */
    delete<T extends ProSequenceDeleteArgs>(args: SelectSubset<T, ProSequenceDeleteArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProSequence.
     * @param {ProSequenceUpdateArgs} args - Arguments to update one ProSequence.
     * @example
     * // Update one ProSequence
     * const proSequence = await prisma.proSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProSequenceUpdateArgs>(args: SelectSubset<T, ProSequenceUpdateArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProSequences.
     * @param {ProSequenceDeleteManyArgs} args - Arguments to filter ProSequences to delete.
     * @example
     * // Delete a few ProSequences
     * const { count } = await prisma.proSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProSequenceDeleteManyArgs>(args?: SelectSubset<T, ProSequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProSequences
     * const proSequence = await prisma.proSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProSequenceUpdateManyArgs>(args: SelectSubset<T, ProSequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProSequence.
     * @param {ProSequenceUpsertArgs} args - Arguments to update or create a ProSequence.
     * @example
     * // Update or create a ProSequence
     * const proSequence = await prisma.proSequence.upsert({
     *   create: {
     *     // ... data to create a ProSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProSequence we want to update
     *   }
     * })
     */
    upsert<T extends ProSequenceUpsertArgs>(args: SelectSubset<T, ProSequenceUpsertArgs<ExtArgs>>): Prisma__ProSequenceClient<$Result.GetResult<Prisma.$ProSequencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceCountArgs} args - Arguments to filter ProSequences to count.
     * @example
     * // Count the number of ProSequences
     * const count = await prisma.proSequence.count({
     *   where: {
     *     // ... the filter for the ProSequences we want to count
     *   }
     * })
    **/
    count<T extends ProSequenceCountArgs>(
      args?: Subset<T, ProSequenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProSequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProSequenceAggregateArgs>(args: Subset<T, ProSequenceAggregateArgs>): Prisma.PrismaPromise<GetProSequenceAggregateType<T>>

    /**
     * Group by ProSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProSequenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProSequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProSequenceGroupByArgs['orderBy'] }
        : { orderBy?: ProSequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProSequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProSequence model
   */
  readonly fields: ProSequenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProSequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProSequenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProSequence model
   */
  interface ProSequenceFieldRefs {
    readonly prefix: FieldRef<"ProSequence", 'String'>
    readonly last: FieldRef<"ProSequence", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProSequence findUnique
   */
  export type ProSequenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter, which ProSequence to fetch.
     */
    where: ProSequenceWhereUniqueInput
  }

  /**
   * ProSequence findUniqueOrThrow
   */
  export type ProSequenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter, which ProSequence to fetch.
     */
    where: ProSequenceWhereUniqueInput
  }

  /**
   * ProSequence findFirst
   */
  export type ProSequenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter, which ProSequence to fetch.
     */
    where?: ProSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSequences to fetch.
     */
    orderBy?: ProSequenceOrderByWithRelationInput | ProSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProSequences.
     */
    cursor?: ProSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProSequences.
     */
    distinct?: ProSequenceScalarFieldEnum | ProSequenceScalarFieldEnum[]
  }

  /**
   * ProSequence findFirstOrThrow
   */
  export type ProSequenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter, which ProSequence to fetch.
     */
    where?: ProSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSequences to fetch.
     */
    orderBy?: ProSequenceOrderByWithRelationInput | ProSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProSequences.
     */
    cursor?: ProSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProSequences.
     */
    distinct?: ProSequenceScalarFieldEnum | ProSequenceScalarFieldEnum[]
  }

  /**
   * ProSequence findMany
   */
  export type ProSequenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter, which ProSequences to fetch.
     */
    where?: ProSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSequences to fetch.
     */
    orderBy?: ProSequenceOrderByWithRelationInput | ProSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProSequences.
     */
    cursor?: ProSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSequences.
     */
    skip?: number
    distinct?: ProSequenceScalarFieldEnum | ProSequenceScalarFieldEnum[]
  }

  /**
   * ProSequence create
   */
  export type ProSequenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * The data needed to create a ProSequence.
     */
    data: XOR<ProSequenceCreateInput, ProSequenceUncheckedCreateInput>
  }

  /**
   * ProSequence createMany
   */
  export type ProSequenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProSequences.
     */
    data: ProSequenceCreateManyInput | ProSequenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProSequence update
   */
  export type ProSequenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * The data needed to update a ProSequence.
     */
    data: XOR<ProSequenceUpdateInput, ProSequenceUncheckedUpdateInput>
    /**
     * Choose, which ProSequence to update.
     */
    where: ProSequenceWhereUniqueInput
  }

  /**
   * ProSequence updateMany
   */
  export type ProSequenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProSequences.
     */
    data: XOR<ProSequenceUpdateManyMutationInput, ProSequenceUncheckedUpdateManyInput>
    /**
     * Filter which ProSequences to update
     */
    where?: ProSequenceWhereInput
    /**
     * Limit how many ProSequences to update.
     */
    limit?: number
  }

  /**
   * ProSequence upsert
   */
  export type ProSequenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * The filter to search for the ProSequence to update in case it exists.
     */
    where: ProSequenceWhereUniqueInput
    /**
     * In case the ProSequence found by the `where` argument doesn't exist, create a new ProSequence with this data.
     */
    create: XOR<ProSequenceCreateInput, ProSequenceUncheckedCreateInput>
    /**
     * In case the ProSequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProSequenceUpdateInput, ProSequenceUncheckedUpdateInput>
  }

  /**
   * ProSequence delete
   */
  export type ProSequenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
    /**
     * Filter which ProSequence to delete.
     */
    where: ProSequenceWhereUniqueInput
  }

  /**
   * ProSequence deleteMany
   */
  export type ProSequenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProSequences to delete
     */
    where?: ProSequenceWhereInput
    /**
     * Limit how many ProSequences to delete.
     */
    limit?: number
  }

  /**
   * ProSequence without action
   */
  export type ProSequenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProSequence
     */
    select?: ProSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProSequence
     */
    omit?: ProSequenceOmit<ExtArgs> | null
  }


  /**
   * Model Pro
   */

  export type AggregatePro = {
    _count: ProCountAggregateOutputType | null
    _avg: ProAvgAggregateOutputType | null
    _sum: ProSumAggregateOutputType | null
    _min: ProMinAggregateOutputType | null
    _max: ProMaxAggregateOutputType | null
  }

  export type ProAvgAggregateOutputType = {
    id: number | null
    qtyPoPcs: number | null
    processId: number | null
  }

  export type ProSumAggregateOutputType = {
    id: number | null
    qtyPoPcs: number | null
    processId: number | null
  }

  export type ProMinAggregateOutputType = {
    id: number | null
    proNumber: string | null
    productName: string | null
    qtyPoPcs: number | null
    startDate: Date | null
    status: $Enums.ProStatus | null
    type: $Enums.ProType | null
    autoShiftExpansion: boolean | null
    processId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProMaxAggregateOutputType = {
    id: number | null
    proNumber: string | null
    productName: string | null
    qtyPoPcs: number | null
    startDate: Date | null
    status: $Enums.ProStatus | null
    type: $Enums.ProType | null
    autoShiftExpansion: boolean | null
    processId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProCountAggregateOutputType = {
    id: number
    proNumber: number
    productName: number
    qtyPoPcs: number
    startDate: number
    status: number
    type: number
    autoShiftExpansion: number
    processId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProAvgAggregateInputType = {
    id?: true
    qtyPoPcs?: true
    processId?: true
  }

  export type ProSumAggregateInputType = {
    id?: true
    qtyPoPcs?: true
    processId?: true
  }

  export type ProMinAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    processId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProMaxAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    processId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProCountAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    processId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pro to aggregate.
     */
    where?: ProWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pros to fetch.
     */
    orderBy?: ProOrderByWithRelationInput | ProOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pros
    **/
    _count?: true | ProCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProMaxAggregateInputType
  }

  export type GetProAggregateType<T extends ProAggregateArgs> = {
        [P in keyof T & keyof AggregatePro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePro[P]>
      : GetScalarType<T[P], AggregatePro[P]>
  }




  export type ProGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProWhereInput
    orderBy?: ProOrderByWithAggregationInput | ProOrderByWithAggregationInput[]
    by: ProScalarFieldEnum[] | ProScalarFieldEnum
    having?: ProScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProCountAggregateInputType | true
    _avg?: ProAvgAggregateInputType
    _sum?: ProSumAggregateInputType
    _min?: ProMinAggregateInputType
    _max?: ProMaxAggregateInputType
  }

  export type ProGroupByOutputType = {
    id: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate: Date | null
    status: $Enums.ProStatus
    type: $Enums.ProType
    autoShiftExpansion: boolean
    processId: number | null
    createdAt: Date
    updatedAt: Date
    _count: ProCountAggregateOutputType | null
    _avg: ProAvgAggregateOutputType | null
    _sum: ProSumAggregateOutputType | null
    _min: ProMinAggregateOutputType | null
    _max: ProMaxAggregateOutputType | null
  }

  type GetProGroupByPayload<T extends ProGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProGroupByOutputType[P]>
            : GetScalarType<T[P], ProGroupByOutputType[P]>
        }
      >
    >


  export type ProSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proNumber?: boolean
    productName?: boolean
    qtyPoPcs?: boolean
    startDate?: boolean
    status?: boolean
    type?: boolean
    autoShiftExpansion?: boolean
    processId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    process?: boolean | Pro$processArgs<ExtArgs>
    steps?: boolean | Pro$stepsArgs<ExtArgs>
    _count?: boolean | ProCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pro"]>



  export type ProSelectScalar = {
    id?: boolean
    proNumber?: boolean
    productName?: boolean
    qtyPoPcs?: boolean
    startDate?: boolean
    status?: boolean
    type?: boolean
    autoShiftExpansion?: boolean
    processId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proNumber" | "productName" | "qtyPoPcs" | "startDate" | "status" | "type" | "autoShiftExpansion" | "processId" | "createdAt" | "updatedAt", ExtArgs["result"]["pro"]>
  export type ProInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    process?: boolean | Pro$processArgs<ExtArgs>
    steps?: boolean | Pro$stepsArgs<ExtArgs>
    _count?: boolean | ProCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pro"
    objects: {
      process: Prisma.$ProcessPayload<ExtArgs> | null
      steps: Prisma.$ProStepPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      proNumber: string
      productName: string
      qtyPoPcs: number
      startDate: Date | null
      status: $Enums.ProStatus
      type: $Enums.ProType
      autoShiftExpansion: boolean
      processId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pro"]>
    composites: {}
  }

  type ProGetPayload<S extends boolean | null | undefined | ProDefaultArgs> = $Result.GetResult<Prisma.$ProPayload, S>

  type ProCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProCountAggregateInputType | true
    }

  export interface ProDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pro'], meta: { name: 'Pro' } }
    /**
     * Find zero or one Pro that matches the filter.
     * @param {ProFindUniqueArgs} args - Arguments to find a Pro
     * @example
     * // Get one Pro
     * const pro = await prisma.pro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProFindUniqueArgs>(args: SelectSubset<T, ProFindUniqueArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pro that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProFindUniqueOrThrowArgs} args - Arguments to find a Pro
     * @example
     * // Get one Pro
     * const pro = await prisma.pro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProFindUniqueOrThrowArgs>(args: SelectSubset<T, ProFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProFindFirstArgs} args - Arguments to find a Pro
     * @example
     * // Get one Pro
     * const pro = await prisma.pro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProFindFirstArgs>(args?: SelectSubset<T, ProFindFirstArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProFindFirstOrThrowArgs} args - Arguments to find a Pro
     * @example
     * // Get one Pro
     * const pro = await prisma.pro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProFindFirstOrThrowArgs>(args?: SelectSubset<T, ProFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pros
     * const pros = await prisma.pro.findMany()
     * 
     * // Get first 10 Pros
     * const pros = await prisma.pro.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const proWithIdOnly = await prisma.pro.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProFindManyArgs>(args?: SelectSubset<T, ProFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pro.
     * @param {ProCreateArgs} args - Arguments to create a Pro.
     * @example
     * // Create one Pro
     * const Pro = await prisma.pro.create({
     *   data: {
     *     // ... data to create a Pro
     *   }
     * })
     * 
     */
    create<T extends ProCreateArgs>(args: SelectSubset<T, ProCreateArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pros.
     * @param {ProCreateManyArgs} args - Arguments to create many Pros.
     * @example
     * // Create many Pros
     * const pro = await prisma.pro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProCreateManyArgs>(args?: SelectSubset<T, ProCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pro.
     * @param {ProDeleteArgs} args - Arguments to delete one Pro.
     * @example
     * // Delete one Pro
     * const Pro = await prisma.pro.delete({
     *   where: {
     *     // ... filter to delete one Pro
     *   }
     * })
     * 
     */
    delete<T extends ProDeleteArgs>(args: SelectSubset<T, ProDeleteArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pro.
     * @param {ProUpdateArgs} args - Arguments to update one Pro.
     * @example
     * // Update one Pro
     * const pro = await prisma.pro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProUpdateArgs>(args: SelectSubset<T, ProUpdateArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pros.
     * @param {ProDeleteManyArgs} args - Arguments to filter Pros to delete.
     * @example
     * // Delete a few Pros
     * const { count } = await prisma.pro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProDeleteManyArgs>(args?: SelectSubset<T, ProDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pros
     * const pro = await prisma.pro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProUpdateManyArgs>(args: SelectSubset<T, ProUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pro.
     * @param {ProUpsertArgs} args - Arguments to update or create a Pro.
     * @example
     * // Update or create a Pro
     * const pro = await prisma.pro.upsert({
     *   create: {
     *     // ... data to create a Pro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pro we want to update
     *   }
     * })
     */
    upsert<T extends ProUpsertArgs>(args: SelectSubset<T, ProUpsertArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProCountArgs} args - Arguments to filter Pros to count.
     * @example
     * // Count the number of Pros
     * const count = await prisma.pro.count({
     *   where: {
     *     // ... the filter for the Pros we want to count
     *   }
     * })
    **/
    count<T extends ProCountArgs>(
      args?: Subset<T, ProCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProAggregateArgs>(args: Subset<T, ProAggregateArgs>): Prisma.PrismaPromise<GetProAggregateType<T>>

    /**
     * Group by Pro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProGroupByArgs['orderBy'] }
        : { orderBy?: ProGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pro model
   */
  readonly fields: ProFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    process<T extends Pro$processArgs<ExtArgs> = {}>(args?: Subset<T, Pro$processArgs<ExtArgs>>): Prisma__ProcessClient<$Result.GetResult<Prisma.$ProcessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    steps<T extends Pro$stepsArgs<ExtArgs> = {}>(args?: Subset<T, Pro$stepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pro model
   */
  interface ProFieldRefs {
    readonly id: FieldRef<"Pro", 'Int'>
    readonly proNumber: FieldRef<"Pro", 'String'>
    readonly productName: FieldRef<"Pro", 'String'>
    readonly qtyPoPcs: FieldRef<"Pro", 'Int'>
    readonly startDate: FieldRef<"Pro", 'DateTime'>
    readonly status: FieldRef<"Pro", 'ProStatus'>
    readonly type: FieldRef<"Pro", 'ProType'>
    readonly autoShiftExpansion: FieldRef<"Pro", 'Boolean'>
    readonly processId: FieldRef<"Pro", 'Int'>
    readonly createdAt: FieldRef<"Pro", 'DateTime'>
    readonly updatedAt: FieldRef<"Pro", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pro findUnique
   */
  export type ProFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter, which Pro to fetch.
     */
    where: ProWhereUniqueInput
  }

  /**
   * Pro findUniqueOrThrow
   */
  export type ProFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter, which Pro to fetch.
     */
    where: ProWhereUniqueInput
  }

  /**
   * Pro findFirst
   */
  export type ProFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter, which Pro to fetch.
     */
    where?: ProWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pros to fetch.
     */
    orderBy?: ProOrderByWithRelationInput | ProOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pros.
     */
    cursor?: ProWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pros.
     */
    distinct?: ProScalarFieldEnum | ProScalarFieldEnum[]
  }

  /**
   * Pro findFirstOrThrow
   */
  export type ProFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter, which Pro to fetch.
     */
    where?: ProWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pros to fetch.
     */
    orderBy?: ProOrderByWithRelationInput | ProOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pros.
     */
    cursor?: ProWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pros.
     */
    distinct?: ProScalarFieldEnum | ProScalarFieldEnum[]
  }

  /**
   * Pro findMany
   */
  export type ProFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter, which Pros to fetch.
     */
    where?: ProWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pros to fetch.
     */
    orderBy?: ProOrderByWithRelationInput | ProOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pros.
     */
    cursor?: ProWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pros.
     */
    skip?: number
    distinct?: ProScalarFieldEnum | ProScalarFieldEnum[]
  }

  /**
   * Pro create
   */
  export type ProCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * The data needed to create a Pro.
     */
    data: XOR<ProCreateInput, ProUncheckedCreateInput>
  }

  /**
   * Pro createMany
   */
  export type ProCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pros.
     */
    data: ProCreateManyInput | ProCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pro update
   */
  export type ProUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * The data needed to update a Pro.
     */
    data: XOR<ProUpdateInput, ProUncheckedUpdateInput>
    /**
     * Choose, which Pro to update.
     */
    where: ProWhereUniqueInput
  }

  /**
   * Pro updateMany
   */
  export type ProUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pros.
     */
    data: XOR<ProUpdateManyMutationInput, ProUncheckedUpdateManyInput>
    /**
     * Filter which Pros to update
     */
    where?: ProWhereInput
    /**
     * Limit how many Pros to update.
     */
    limit?: number
  }

  /**
   * Pro upsert
   */
  export type ProUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * The filter to search for the Pro to update in case it exists.
     */
    where: ProWhereUniqueInput
    /**
     * In case the Pro found by the `where` argument doesn't exist, create a new Pro with this data.
     */
    create: XOR<ProCreateInput, ProUncheckedCreateInput>
    /**
     * In case the Pro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProUpdateInput, ProUncheckedUpdateInput>
  }

  /**
   * Pro delete
   */
  export type ProDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
    /**
     * Filter which Pro to delete.
     */
    where: ProWhereUniqueInput
  }

  /**
   * Pro deleteMany
   */
  export type ProDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pros to delete
     */
    where?: ProWhereInput
    /**
     * Limit how many Pros to delete.
     */
    limit?: number
  }

  /**
   * Pro.process
   */
  export type Pro$processArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Process
     */
    select?: ProcessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Process
     */
    omit?: ProcessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessInclude<ExtArgs> | null
    where?: ProcessWhereInput
  }

  /**
   * Pro.steps
   */
  export type Pro$stepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    where?: ProStepWhereInput
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    cursor?: ProStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProStepScalarFieldEnum | ProStepScalarFieldEnum[]
  }

  /**
   * Pro without action
   */
  export type ProDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pro
     */
    select?: ProSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pro
     */
    omit?: ProOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProInclude<ExtArgs> | null
  }


  /**
   * Model ProStep
   */

  export type AggregateProStep = {
    _count: ProStepCountAggregateOutputType | null
    _avg: ProStepAvgAggregateOutputType | null
    _sum: ProStepSumAggregateOutputType | null
    _min: ProStepMinAggregateOutputType | null
    _max: ProStepMaxAggregateOutputType | null
  }

  export type ProStepAvgAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    machineId: number | null
    manPowerStd: number | null
    cycleTimeStd: Decimal | null
    cavityStd: number | null
  }

  export type ProStepSumAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    machineId: number | null
    manPowerStd: number | null
    cycleTimeStd: Decimal | null
    cavityStd: number | null
  }

  export type ProStepMinAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    manPowerStd: number | null
    cycleTimeStd: Decimal | null
    cavityStd: number | null
  }

  export type ProStepMaxAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    manPowerStd: number | null
    cycleTimeStd: Decimal | null
    cavityStd: number | null
  }

  export type ProStepCountAggregateOutputType = {
    id: number
    proId: number
    orderNo: number
    up: number
    estimatedShifts: number
    startDate: number
    machineId: number
    partNumber: number
    manPowerStd: number
    cycleTimeStd: number
    cavityStd: number
    _all: number
  }


  export type ProStepAvgAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    machineId?: true
    manPowerStd?: true
    cycleTimeStd?: true
    cavityStd?: true
  }

  export type ProStepSumAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    machineId?: true
    manPowerStd?: true
    cycleTimeStd?: true
    cavityStd?: true
  }

  export type ProStepMinAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    manPowerStd?: true
    cycleTimeStd?: true
    cavityStd?: true
  }

  export type ProStepMaxAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    manPowerStd?: true
    cycleTimeStd?: true
    cavityStd?: true
  }

  export type ProStepCountAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    manPowerStd?: true
    cycleTimeStd?: true
    cavityStd?: true
    _all?: true
  }

  export type ProStepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProStep to aggregate.
     */
    where?: ProStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSteps to fetch.
     */
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProSteps
    **/
    _count?: true | ProStepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProStepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProStepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProStepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProStepMaxAggregateInputType
  }

  export type GetProStepAggregateType<T extends ProStepAggregateArgs> = {
        [P in keyof T & keyof AggregateProStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProStep[P]>
      : GetScalarType<T[P], AggregateProStep[P]>
  }




  export type ProStepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepWhereInput
    orderBy?: ProStepOrderByWithAggregationInput | ProStepOrderByWithAggregationInput[]
    by: ProStepScalarFieldEnum[] | ProStepScalarFieldEnum
    having?: ProStepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProStepCountAggregateInputType | true
    _avg?: ProStepAvgAggregateInputType
    _sum?: ProStepSumAggregateInputType
    _min?: ProStepMinAggregateInputType
    _max?: ProStepMaxAggregateInputType
  }

  export type ProStepGroupByOutputType = {
    id: number
    proId: number
    orderNo: number
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    manPowerStd: number | null
    cycleTimeStd: Decimal | null
    cavityStd: number | null
    _count: ProStepCountAggregateOutputType | null
    _avg: ProStepAvgAggregateOutputType | null
    _sum: ProStepSumAggregateOutputType | null
    _min: ProStepMinAggregateOutputType | null
    _max: ProStepMaxAggregateOutputType | null
  }

  type GetProStepGroupByPayload<T extends ProStepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProStepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProStepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProStepGroupByOutputType[P]>
            : GetScalarType<T[P], ProStepGroupByOutputType[P]>
        }
      >
    >


  export type ProStepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proId?: boolean
    orderNo?: boolean
    up?: boolean
    estimatedShifts?: boolean
    startDate?: boolean
    machineId?: boolean
    partNumber?: boolean
    manPowerStd?: boolean
    cycleTimeStd?: boolean
    cavityStd?: boolean
    pro?: boolean | ProDefaultArgs<ExtArgs>
    machine?: boolean | ProStep$machineArgs<ExtArgs>
    materials?: boolean | ProStep$materialsArgs<ExtArgs>
    productionReports?: boolean | ProStep$productionReportsArgs<ExtArgs>
    _count?: boolean | ProStepCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proStep"]>



  export type ProStepSelectScalar = {
    id?: boolean
    proId?: boolean
    orderNo?: boolean
    up?: boolean
    estimatedShifts?: boolean
    startDate?: boolean
    machineId?: boolean
    partNumber?: boolean
    manPowerStd?: boolean
    cycleTimeStd?: boolean
    cavityStd?: boolean
  }

  export type ProStepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proId" | "orderNo" | "up" | "estimatedShifts" | "startDate" | "machineId" | "partNumber" | "manPowerStd" | "cycleTimeStd" | "cavityStd", ExtArgs["result"]["proStep"]>
  export type ProStepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pro?: boolean | ProDefaultArgs<ExtArgs>
    machine?: boolean | ProStep$machineArgs<ExtArgs>
    materials?: boolean | ProStep$materialsArgs<ExtArgs>
    productionReports?: boolean | ProStep$productionReportsArgs<ExtArgs>
    _count?: boolean | ProStepCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProStepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProStep"
    objects: {
      pro: Prisma.$ProPayload<ExtArgs>
      machine: Prisma.$MachinePayload<ExtArgs> | null
      materials: Prisma.$ProStepMaterialPayload<ExtArgs>[]
      productionReports: Prisma.$ProductionReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      proId: number
      orderNo: number
      up: number | null
      estimatedShifts: number | null
      startDate: Date | null
      machineId: number | null
      partNumber: string | null
      manPowerStd: number | null
      cycleTimeStd: Prisma.Decimal | null
      cavityStd: number | null
    }, ExtArgs["result"]["proStep"]>
    composites: {}
  }

  type ProStepGetPayload<S extends boolean | null | undefined | ProStepDefaultArgs> = $Result.GetResult<Prisma.$ProStepPayload, S>

  type ProStepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProStepCountAggregateInputType | true
    }

  export interface ProStepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProStep'], meta: { name: 'ProStep' } }
    /**
     * Find zero or one ProStep that matches the filter.
     * @param {ProStepFindUniqueArgs} args - Arguments to find a ProStep
     * @example
     * // Get one ProStep
     * const proStep = await prisma.proStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProStepFindUniqueArgs>(args: SelectSubset<T, ProStepFindUniqueArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProStepFindUniqueOrThrowArgs} args - Arguments to find a ProStep
     * @example
     * // Get one ProStep
     * const proStep = await prisma.proStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProStepFindUniqueOrThrowArgs>(args: SelectSubset<T, ProStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepFindFirstArgs} args - Arguments to find a ProStep
     * @example
     * // Get one ProStep
     * const proStep = await prisma.proStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProStepFindFirstArgs>(args?: SelectSubset<T, ProStepFindFirstArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepFindFirstOrThrowArgs} args - Arguments to find a ProStep
     * @example
     * // Get one ProStep
     * const proStep = await prisma.proStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProStepFindFirstOrThrowArgs>(args?: SelectSubset<T, ProStepFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProSteps
     * const proSteps = await prisma.proStep.findMany()
     * 
     * // Get first 10 ProSteps
     * const proSteps = await prisma.proStep.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const proStepWithIdOnly = await prisma.proStep.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProStepFindManyArgs>(args?: SelectSubset<T, ProStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProStep.
     * @param {ProStepCreateArgs} args - Arguments to create a ProStep.
     * @example
     * // Create one ProStep
     * const ProStep = await prisma.proStep.create({
     *   data: {
     *     // ... data to create a ProStep
     *   }
     * })
     * 
     */
    create<T extends ProStepCreateArgs>(args: SelectSubset<T, ProStepCreateArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProSteps.
     * @param {ProStepCreateManyArgs} args - Arguments to create many ProSteps.
     * @example
     * // Create many ProSteps
     * const proStep = await prisma.proStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProStepCreateManyArgs>(args?: SelectSubset<T, ProStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProStep.
     * @param {ProStepDeleteArgs} args - Arguments to delete one ProStep.
     * @example
     * // Delete one ProStep
     * const ProStep = await prisma.proStep.delete({
     *   where: {
     *     // ... filter to delete one ProStep
     *   }
     * })
     * 
     */
    delete<T extends ProStepDeleteArgs>(args: SelectSubset<T, ProStepDeleteArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProStep.
     * @param {ProStepUpdateArgs} args - Arguments to update one ProStep.
     * @example
     * // Update one ProStep
     * const proStep = await prisma.proStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProStepUpdateArgs>(args: SelectSubset<T, ProStepUpdateArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProSteps.
     * @param {ProStepDeleteManyArgs} args - Arguments to filter ProSteps to delete.
     * @example
     * // Delete a few ProSteps
     * const { count } = await prisma.proStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProStepDeleteManyArgs>(args?: SelectSubset<T, ProStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProSteps
     * const proStep = await prisma.proStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProStepUpdateManyArgs>(args: SelectSubset<T, ProStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProStep.
     * @param {ProStepUpsertArgs} args - Arguments to update or create a ProStep.
     * @example
     * // Update or create a ProStep
     * const proStep = await prisma.proStep.upsert({
     *   create: {
     *     // ... data to create a ProStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProStep we want to update
     *   }
     * })
     */
    upsert<T extends ProStepUpsertArgs>(args: SelectSubset<T, ProStepUpsertArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepCountArgs} args - Arguments to filter ProSteps to count.
     * @example
     * // Count the number of ProSteps
     * const count = await prisma.proStep.count({
     *   where: {
     *     // ... the filter for the ProSteps we want to count
     *   }
     * })
    **/
    count<T extends ProStepCountArgs>(
      args?: Subset<T, ProStepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProStepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProStepAggregateArgs>(args: Subset<T, ProStepAggregateArgs>): Prisma.PrismaPromise<GetProStepAggregateType<T>>

    /**
     * Group by ProStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProStepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProStepGroupByArgs['orderBy'] }
        : { orderBy?: ProStepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProStep model
   */
  readonly fields: ProStepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProStep.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProStepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pro<T extends ProDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProDefaultArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    machine<T extends ProStep$machineArgs<ExtArgs> = {}>(args?: Subset<T, ProStep$machineArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    materials<T extends ProStep$materialsArgs<ExtArgs> = {}>(args?: Subset<T, ProStep$materialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    productionReports<T extends ProStep$productionReportsArgs<ExtArgs> = {}>(args?: Subset<T, ProStep$productionReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProStep model
   */
  interface ProStepFieldRefs {
    readonly id: FieldRef<"ProStep", 'Int'>
    readonly proId: FieldRef<"ProStep", 'Int'>
    readonly orderNo: FieldRef<"ProStep", 'Int'>
    readonly up: FieldRef<"ProStep", 'Int'>
    readonly estimatedShifts: FieldRef<"ProStep", 'Int'>
    readonly startDate: FieldRef<"ProStep", 'DateTime'>
    readonly machineId: FieldRef<"ProStep", 'Int'>
    readonly partNumber: FieldRef<"ProStep", 'String'>
    readonly manPowerStd: FieldRef<"ProStep", 'Int'>
    readonly cycleTimeStd: FieldRef<"ProStep", 'Decimal'>
    readonly cavityStd: FieldRef<"ProStep", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProStep findUnique
   */
  export type ProStepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter, which ProStep to fetch.
     */
    where: ProStepWhereUniqueInput
  }

  /**
   * ProStep findUniqueOrThrow
   */
  export type ProStepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter, which ProStep to fetch.
     */
    where: ProStepWhereUniqueInput
  }

  /**
   * ProStep findFirst
   */
  export type ProStepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter, which ProStep to fetch.
     */
    where?: ProStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSteps to fetch.
     */
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProSteps.
     */
    cursor?: ProStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProSteps.
     */
    distinct?: ProStepScalarFieldEnum | ProStepScalarFieldEnum[]
  }

  /**
   * ProStep findFirstOrThrow
   */
  export type ProStepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter, which ProStep to fetch.
     */
    where?: ProStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSteps to fetch.
     */
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProSteps.
     */
    cursor?: ProStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProSteps.
     */
    distinct?: ProStepScalarFieldEnum | ProStepScalarFieldEnum[]
  }

  /**
   * ProStep findMany
   */
  export type ProStepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter, which ProSteps to fetch.
     */
    where?: ProStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProSteps to fetch.
     */
    orderBy?: ProStepOrderByWithRelationInput | ProStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProSteps.
     */
    cursor?: ProStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProSteps.
     */
    skip?: number
    distinct?: ProStepScalarFieldEnum | ProStepScalarFieldEnum[]
  }

  /**
   * ProStep create
   */
  export type ProStepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * The data needed to create a ProStep.
     */
    data: XOR<ProStepCreateInput, ProStepUncheckedCreateInput>
  }

  /**
   * ProStep createMany
   */
  export type ProStepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProSteps.
     */
    data: ProStepCreateManyInput | ProStepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProStep update
   */
  export type ProStepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * The data needed to update a ProStep.
     */
    data: XOR<ProStepUpdateInput, ProStepUncheckedUpdateInput>
    /**
     * Choose, which ProStep to update.
     */
    where: ProStepWhereUniqueInput
  }

  /**
   * ProStep updateMany
   */
  export type ProStepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProSteps.
     */
    data: XOR<ProStepUpdateManyMutationInput, ProStepUncheckedUpdateManyInput>
    /**
     * Filter which ProSteps to update
     */
    where?: ProStepWhereInput
    /**
     * Limit how many ProSteps to update.
     */
    limit?: number
  }

  /**
   * ProStep upsert
   */
  export type ProStepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * The filter to search for the ProStep to update in case it exists.
     */
    where: ProStepWhereUniqueInput
    /**
     * In case the ProStep found by the `where` argument doesn't exist, create a new ProStep with this data.
     */
    create: XOR<ProStepCreateInput, ProStepUncheckedCreateInput>
    /**
     * In case the ProStep was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProStepUpdateInput, ProStepUncheckedUpdateInput>
  }

  /**
   * ProStep delete
   */
  export type ProStepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
    /**
     * Filter which ProStep to delete.
     */
    where: ProStepWhereUniqueInput
  }

  /**
   * ProStep deleteMany
   */
  export type ProStepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProSteps to delete
     */
    where?: ProStepWhereInput
    /**
     * Limit how many ProSteps to delete.
     */
    limit?: number
  }

  /**
   * ProStep.machine
   */
  export type ProStep$machineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Machine
     */
    select?: MachineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Machine
     */
    omit?: MachineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MachineInclude<ExtArgs> | null
    where?: MachineWhereInput
  }

  /**
   * ProStep.materials
   */
  export type ProStep$materialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    where?: ProStepMaterialWhereInput
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    cursor?: ProStepMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProStepMaterialScalarFieldEnum | ProStepMaterialScalarFieldEnum[]
  }

  /**
   * ProStep.productionReports
   */
  export type ProStep$productionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    where?: ProductionReportWhereInput
    orderBy?: ProductionReportOrderByWithRelationInput | ProductionReportOrderByWithRelationInput[]
    cursor?: ProductionReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductionReportScalarFieldEnum | ProductionReportScalarFieldEnum[]
  }

  /**
   * ProStep without action
   */
  export type ProStepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStep
     */
    select?: ProStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStep
     */
    omit?: ProStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepInclude<ExtArgs> | null
  }


  /**
   * Model ProStepMaterial
   */

  export type AggregateProStepMaterial = {
    _count: ProStepMaterialCountAggregateOutputType | null
    _avg: ProStepMaterialAvgAggregateOutputType | null
    _sum: ProStepMaterialSumAggregateOutputType | null
    _min: ProStepMaterialMinAggregateOutputType | null
    _max: ProStepMaterialMaxAggregateOutputType | null
  }

  export type ProStepMaterialAvgAggregateOutputType = {
    id: number | null
    stepId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProStepMaterialSumAggregateOutputType = {
    id: number | null
    stepId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProStepMaterialMinAggregateOutputType = {
    id: number | null
    stepId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProStepMaterialMaxAggregateOutputType = {
    id: number | null
    stepId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProStepMaterialCountAggregateOutputType = {
    id: number
    stepId: number
    materialId: number
    qtyReq: number
    _all: number
  }


  export type ProStepMaterialAvgAggregateInputType = {
    id?: true
    stepId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProStepMaterialSumAggregateInputType = {
    id?: true
    stepId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProStepMaterialMinAggregateInputType = {
    id?: true
    stepId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProStepMaterialMaxAggregateInputType = {
    id?: true
    stepId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProStepMaterialCountAggregateInputType = {
    id?: true
    stepId?: true
    materialId?: true
    qtyReq?: true
    _all?: true
  }

  export type ProStepMaterialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProStepMaterial to aggregate.
     */
    where?: ProStepMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProStepMaterials to fetch.
     */
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProStepMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProStepMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProStepMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProStepMaterials
    **/
    _count?: true | ProStepMaterialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProStepMaterialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProStepMaterialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProStepMaterialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProStepMaterialMaxAggregateInputType
  }

  export type GetProStepMaterialAggregateType<T extends ProStepMaterialAggregateArgs> = {
        [P in keyof T & keyof AggregateProStepMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProStepMaterial[P]>
      : GetScalarType<T[P], AggregateProStepMaterial[P]>
  }




  export type ProStepMaterialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProStepMaterialWhereInput
    orderBy?: ProStepMaterialOrderByWithAggregationInput | ProStepMaterialOrderByWithAggregationInput[]
    by: ProStepMaterialScalarFieldEnum[] | ProStepMaterialScalarFieldEnum
    having?: ProStepMaterialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProStepMaterialCountAggregateInputType | true
    _avg?: ProStepMaterialAvgAggregateInputType
    _sum?: ProStepMaterialSumAggregateInputType
    _min?: ProStepMaterialMinAggregateInputType
    _max?: ProStepMaterialMaxAggregateInputType
  }

  export type ProStepMaterialGroupByOutputType = {
    id: number
    stepId: number
    materialId: number
    qtyReq: Decimal
    _count: ProStepMaterialCountAggregateOutputType | null
    _avg: ProStepMaterialAvgAggregateOutputType | null
    _sum: ProStepMaterialSumAggregateOutputType | null
    _min: ProStepMaterialMinAggregateOutputType | null
    _max: ProStepMaterialMaxAggregateOutputType | null
  }

  type GetProStepMaterialGroupByPayload<T extends ProStepMaterialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProStepMaterialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProStepMaterialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProStepMaterialGroupByOutputType[P]>
            : GetScalarType<T[P], ProStepMaterialGroupByOutputType[P]>
        }
      >
    >


  export type ProStepMaterialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stepId?: boolean
    materialId?: boolean
    qtyReq?: boolean
    step?: boolean | ProStepDefaultArgs<ExtArgs>
    material?: boolean | MaterialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proStepMaterial"]>



  export type ProStepMaterialSelectScalar = {
    id?: boolean
    stepId?: boolean
    materialId?: boolean
    qtyReq?: boolean
  }

  export type ProStepMaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "stepId" | "materialId" | "qtyReq", ExtArgs["result"]["proStepMaterial"]>
  export type ProStepMaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    step?: boolean | ProStepDefaultArgs<ExtArgs>
    material?: boolean | MaterialDefaultArgs<ExtArgs>
  }

  export type $ProStepMaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProStepMaterial"
    objects: {
      step: Prisma.$ProStepPayload<ExtArgs>
      material: Prisma.$MaterialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      stepId: number
      materialId: number
      qtyReq: Prisma.Decimal
    }, ExtArgs["result"]["proStepMaterial"]>
    composites: {}
  }

  type ProStepMaterialGetPayload<S extends boolean | null | undefined | ProStepMaterialDefaultArgs> = $Result.GetResult<Prisma.$ProStepMaterialPayload, S>

  type ProStepMaterialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProStepMaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProStepMaterialCountAggregateInputType | true
    }

  export interface ProStepMaterialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProStepMaterial'], meta: { name: 'ProStepMaterial' } }
    /**
     * Find zero or one ProStepMaterial that matches the filter.
     * @param {ProStepMaterialFindUniqueArgs} args - Arguments to find a ProStepMaterial
     * @example
     * // Get one ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProStepMaterialFindUniqueArgs>(args: SelectSubset<T, ProStepMaterialFindUniqueArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProStepMaterial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProStepMaterialFindUniqueOrThrowArgs} args - Arguments to find a ProStepMaterial
     * @example
     * // Get one ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProStepMaterialFindUniqueOrThrowArgs>(args: SelectSubset<T, ProStepMaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProStepMaterial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialFindFirstArgs} args - Arguments to find a ProStepMaterial
     * @example
     * // Get one ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProStepMaterialFindFirstArgs>(args?: SelectSubset<T, ProStepMaterialFindFirstArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProStepMaterial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialFindFirstOrThrowArgs} args - Arguments to find a ProStepMaterial
     * @example
     * // Get one ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProStepMaterialFindFirstOrThrowArgs>(args?: SelectSubset<T, ProStepMaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProStepMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProStepMaterials
     * const proStepMaterials = await prisma.proStepMaterial.findMany()
     * 
     * // Get first 10 ProStepMaterials
     * const proStepMaterials = await prisma.proStepMaterial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const proStepMaterialWithIdOnly = await prisma.proStepMaterial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProStepMaterialFindManyArgs>(args?: SelectSubset<T, ProStepMaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProStepMaterial.
     * @param {ProStepMaterialCreateArgs} args - Arguments to create a ProStepMaterial.
     * @example
     * // Create one ProStepMaterial
     * const ProStepMaterial = await prisma.proStepMaterial.create({
     *   data: {
     *     // ... data to create a ProStepMaterial
     *   }
     * })
     * 
     */
    create<T extends ProStepMaterialCreateArgs>(args: SelectSubset<T, ProStepMaterialCreateArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProStepMaterials.
     * @param {ProStepMaterialCreateManyArgs} args - Arguments to create many ProStepMaterials.
     * @example
     * // Create many ProStepMaterials
     * const proStepMaterial = await prisma.proStepMaterial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProStepMaterialCreateManyArgs>(args?: SelectSubset<T, ProStepMaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProStepMaterial.
     * @param {ProStepMaterialDeleteArgs} args - Arguments to delete one ProStepMaterial.
     * @example
     * // Delete one ProStepMaterial
     * const ProStepMaterial = await prisma.proStepMaterial.delete({
     *   where: {
     *     // ... filter to delete one ProStepMaterial
     *   }
     * })
     * 
     */
    delete<T extends ProStepMaterialDeleteArgs>(args: SelectSubset<T, ProStepMaterialDeleteArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProStepMaterial.
     * @param {ProStepMaterialUpdateArgs} args - Arguments to update one ProStepMaterial.
     * @example
     * // Update one ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProStepMaterialUpdateArgs>(args: SelectSubset<T, ProStepMaterialUpdateArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProStepMaterials.
     * @param {ProStepMaterialDeleteManyArgs} args - Arguments to filter ProStepMaterials to delete.
     * @example
     * // Delete a few ProStepMaterials
     * const { count } = await prisma.proStepMaterial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProStepMaterialDeleteManyArgs>(args?: SelectSubset<T, ProStepMaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProStepMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProStepMaterials
     * const proStepMaterial = await prisma.proStepMaterial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProStepMaterialUpdateManyArgs>(args: SelectSubset<T, ProStepMaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProStepMaterial.
     * @param {ProStepMaterialUpsertArgs} args - Arguments to update or create a ProStepMaterial.
     * @example
     * // Update or create a ProStepMaterial
     * const proStepMaterial = await prisma.proStepMaterial.upsert({
     *   create: {
     *     // ... data to create a ProStepMaterial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProStepMaterial we want to update
     *   }
     * })
     */
    upsert<T extends ProStepMaterialUpsertArgs>(args: SelectSubset<T, ProStepMaterialUpsertArgs<ExtArgs>>): Prisma__ProStepMaterialClient<$Result.GetResult<Prisma.$ProStepMaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProStepMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialCountArgs} args - Arguments to filter ProStepMaterials to count.
     * @example
     * // Count the number of ProStepMaterials
     * const count = await prisma.proStepMaterial.count({
     *   where: {
     *     // ... the filter for the ProStepMaterials we want to count
     *   }
     * })
    **/
    count<T extends ProStepMaterialCountArgs>(
      args?: Subset<T, ProStepMaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProStepMaterialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProStepMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProStepMaterialAggregateArgs>(args: Subset<T, ProStepMaterialAggregateArgs>): Prisma.PrismaPromise<GetProStepMaterialAggregateType<T>>

    /**
     * Group by ProStepMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProStepMaterialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProStepMaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProStepMaterialGroupByArgs['orderBy'] }
        : { orderBy?: ProStepMaterialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProStepMaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProStepMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProStepMaterial model
   */
  readonly fields: ProStepMaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProStepMaterial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProStepMaterialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    step<T extends ProStepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProStepDefaultArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    material<T extends MaterialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MaterialDefaultArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProStepMaterial model
   */
  interface ProStepMaterialFieldRefs {
    readonly id: FieldRef<"ProStepMaterial", 'Int'>
    readonly stepId: FieldRef<"ProStepMaterial", 'Int'>
    readonly materialId: FieldRef<"ProStepMaterial", 'Int'>
    readonly qtyReq: FieldRef<"ProStepMaterial", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ProStepMaterial findUnique
   */
  export type ProStepMaterialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProStepMaterial to fetch.
     */
    where: ProStepMaterialWhereUniqueInput
  }

  /**
   * ProStepMaterial findUniqueOrThrow
   */
  export type ProStepMaterialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProStepMaterial to fetch.
     */
    where: ProStepMaterialWhereUniqueInput
  }

  /**
   * ProStepMaterial findFirst
   */
  export type ProStepMaterialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProStepMaterial to fetch.
     */
    where?: ProStepMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProStepMaterials to fetch.
     */
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProStepMaterials.
     */
    cursor?: ProStepMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProStepMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProStepMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProStepMaterials.
     */
    distinct?: ProStepMaterialScalarFieldEnum | ProStepMaterialScalarFieldEnum[]
  }

  /**
   * ProStepMaterial findFirstOrThrow
   */
  export type ProStepMaterialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProStepMaterial to fetch.
     */
    where?: ProStepMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProStepMaterials to fetch.
     */
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProStepMaterials.
     */
    cursor?: ProStepMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProStepMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProStepMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProStepMaterials.
     */
    distinct?: ProStepMaterialScalarFieldEnum | ProStepMaterialScalarFieldEnum[]
  }

  /**
   * ProStepMaterial findMany
   */
  export type ProStepMaterialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProStepMaterials to fetch.
     */
    where?: ProStepMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProStepMaterials to fetch.
     */
    orderBy?: ProStepMaterialOrderByWithRelationInput | ProStepMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProStepMaterials.
     */
    cursor?: ProStepMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProStepMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProStepMaterials.
     */
    skip?: number
    distinct?: ProStepMaterialScalarFieldEnum | ProStepMaterialScalarFieldEnum[]
  }

  /**
   * ProStepMaterial create
   */
  export type ProStepMaterialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * The data needed to create a ProStepMaterial.
     */
    data: XOR<ProStepMaterialCreateInput, ProStepMaterialUncheckedCreateInput>
  }

  /**
   * ProStepMaterial createMany
   */
  export type ProStepMaterialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProStepMaterials.
     */
    data: ProStepMaterialCreateManyInput | ProStepMaterialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProStepMaterial update
   */
  export type ProStepMaterialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * The data needed to update a ProStepMaterial.
     */
    data: XOR<ProStepMaterialUpdateInput, ProStepMaterialUncheckedUpdateInput>
    /**
     * Choose, which ProStepMaterial to update.
     */
    where: ProStepMaterialWhereUniqueInput
  }

  /**
   * ProStepMaterial updateMany
   */
  export type ProStepMaterialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProStepMaterials.
     */
    data: XOR<ProStepMaterialUpdateManyMutationInput, ProStepMaterialUncheckedUpdateManyInput>
    /**
     * Filter which ProStepMaterials to update
     */
    where?: ProStepMaterialWhereInput
    /**
     * Limit how many ProStepMaterials to update.
     */
    limit?: number
  }

  /**
   * ProStepMaterial upsert
   */
  export type ProStepMaterialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * The filter to search for the ProStepMaterial to update in case it exists.
     */
    where: ProStepMaterialWhereUniqueInput
    /**
     * In case the ProStepMaterial found by the `where` argument doesn't exist, create a new ProStepMaterial with this data.
     */
    create: XOR<ProStepMaterialCreateInput, ProStepMaterialUncheckedCreateInput>
    /**
     * In case the ProStepMaterial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProStepMaterialUpdateInput, ProStepMaterialUncheckedUpdateInput>
  }

  /**
   * ProStepMaterial delete
   */
  export type ProStepMaterialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
    /**
     * Filter which ProStepMaterial to delete.
     */
    where: ProStepMaterialWhereUniqueInput
  }

  /**
   * ProStepMaterial deleteMany
   */
  export type ProStepMaterialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProStepMaterials to delete
     */
    where?: ProStepMaterialWhereInput
    /**
     * Limit how many ProStepMaterials to delete.
     */
    limit?: number
  }

  /**
   * ProStepMaterial without action
   */
  export type ProStepMaterialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProStepMaterial
     */
    select?: ProStepMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProStepMaterial
     */
    omit?: ProStepMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProStepMaterialInclude<ExtArgs> | null
  }


  /**
   * Model ProductionReport
   */

  export type AggregateProductionReport = {
    _count: ProductionReportCountAggregateOutputType | null
    _avg: ProductionReportAvgAggregateOutputType | null
    _sum: ProductionReportSumAggregateOutputType | null
    _min: ProductionReportMinAggregateOutputType | null
    _max: ProductionReportMaxAggregateOutputType | null
  }

  export type ProductionReportAvgAggregateOutputType = {
    proStepId: number | null
    shift: number | null
    manPowerStd: number | null
    manPowerAct: number | null
    cycleTimeStd: Decimal | null
    cycleTimeAct: Decimal | null
    cavityStd: number | null
    cavityAct: number | null
    inputMaterialQty: Decimal | null
    materialRunnerQty: Decimal | null
    materialPurgeQty: Decimal | null
    qtyPassOn: Decimal | null
    qtyHold: Decimal | null
    qtyWip: Decimal | null
    qtyGood: Decimal | null
    qtyReject: Decimal | null
    totalDowntime: number | null
  }

  export type ProductionReportSumAggregateOutputType = {
    proStepId: number | null
    shift: number | null
    manPowerStd: number | null
    manPowerAct: number | null
    cycleTimeStd: Decimal | null
    cycleTimeAct: Decimal | null
    cavityStd: number | null
    cavityAct: number | null
    inputMaterialQty: Decimal | null
    materialRunnerQty: Decimal | null
    materialPurgeQty: Decimal | null
    qtyPassOn: Decimal | null
    qtyHold: Decimal | null
    qtyWip: Decimal | null
    qtyGood: Decimal | null
    qtyReject: Decimal | null
    totalDowntime: number | null
  }

  export type ProductionReportMinAggregateOutputType = {
    id: string | null
    proStepId: number | null
    reportDate: Date | null
    shift: number | null
    operatorName: string | null
    reportType: $Enums.LphType | null
    startTime: Date | null
    endTime: Date | null
    batchNo: string | null
    manPowerStd: number | null
    manPowerAct: number | null
    cycleTimeStd: Decimal | null
    cycleTimeAct: Decimal | null
    cavityStd: number | null
    cavityAct: number | null
    inputMaterialQty: Decimal | null
    materialRunnerQty: Decimal | null
    materialPurgeQty: Decimal | null
    qtyPassOn: Decimal | null
    qtyHold: Decimal | null
    qtyWip: Decimal | null
    qtyGood: Decimal | null
    qtyReject: Decimal | null
    totalDowntime: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductionReportMaxAggregateOutputType = {
    id: string | null
    proStepId: number | null
    reportDate: Date | null
    shift: number | null
    operatorName: string | null
    reportType: $Enums.LphType | null
    startTime: Date | null
    endTime: Date | null
    batchNo: string | null
    manPowerStd: number | null
    manPowerAct: number | null
    cycleTimeStd: Decimal | null
    cycleTimeAct: Decimal | null
    cavityStd: number | null
    cavityAct: number | null
    inputMaterialQty: Decimal | null
    materialRunnerQty: Decimal | null
    materialPurgeQty: Decimal | null
    qtyPassOn: Decimal | null
    qtyHold: Decimal | null
    qtyWip: Decimal | null
    qtyGood: Decimal | null
    qtyReject: Decimal | null
    totalDowntime: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductionReportCountAggregateOutputType = {
    id: number
    proStepId: number
    reportDate: number
    shift: number
    operatorName: number
    reportType: number
    startTime: number
    endTime: number
    batchNo: number
    manPowerStd: number
    manPowerAct: number
    cycleTimeStd: number
    cycleTimeAct: number
    cavityStd: number
    cavityAct: number
    inputMaterialQty: number
    materialRunnerQty: number
    materialPurgeQty: number
    qtyPassOn: number
    qtyHold: number
    qtyWip: number
    qtyGood: number
    qtyReject: number
    rejectBreakdown: number
    downtimeBreakdown: number
    totalDowntime: number
    notes: number
    metaData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductionReportAvgAggregateInputType = {
    proStepId?: true
    shift?: true
    manPowerStd?: true
    manPowerAct?: true
    cycleTimeStd?: true
    cycleTimeAct?: true
    cavityStd?: true
    cavityAct?: true
    inputMaterialQty?: true
    materialRunnerQty?: true
    materialPurgeQty?: true
    qtyPassOn?: true
    qtyHold?: true
    qtyWip?: true
    qtyGood?: true
    qtyReject?: true
    totalDowntime?: true
  }

  export type ProductionReportSumAggregateInputType = {
    proStepId?: true
    shift?: true
    manPowerStd?: true
    manPowerAct?: true
    cycleTimeStd?: true
    cycleTimeAct?: true
    cavityStd?: true
    cavityAct?: true
    inputMaterialQty?: true
    materialRunnerQty?: true
    materialPurgeQty?: true
    qtyPassOn?: true
    qtyHold?: true
    qtyWip?: true
    qtyGood?: true
    qtyReject?: true
    totalDowntime?: true
  }

  export type ProductionReportMinAggregateInputType = {
    id?: true
    proStepId?: true
    reportDate?: true
    shift?: true
    operatorName?: true
    reportType?: true
    startTime?: true
    endTime?: true
    batchNo?: true
    manPowerStd?: true
    manPowerAct?: true
    cycleTimeStd?: true
    cycleTimeAct?: true
    cavityStd?: true
    cavityAct?: true
    inputMaterialQty?: true
    materialRunnerQty?: true
    materialPurgeQty?: true
    qtyPassOn?: true
    qtyHold?: true
    qtyWip?: true
    qtyGood?: true
    qtyReject?: true
    totalDowntime?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductionReportMaxAggregateInputType = {
    id?: true
    proStepId?: true
    reportDate?: true
    shift?: true
    operatorName?: true
    reportType?: true
    startTime?: true
    endTime?: true
    batchNo?: true
    manPowerStd?: true
    manPowerAct?: true
    cycleTimeStd?: true
    cycleTimeAct?: true
    cavityStd?: true
    cavityAct?: true
    inputMaterialQty?: true
    materialRunnerQty?: true
    materialPurgeQty?: true
    qtyPassOn?: true
    qtyHold?: true
    qtyWip?: true
    qtyGood?: true
    qtyReject?: true
    totalDowntime?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductionReportCountAggregateInputType = {
    id?: true
    proStepId?: true
    reportDate?: true
    shift?: true
    operatorName?: true
    reportType?: true
    startTime?: true
    endTime?: true
    batchNo?: true
    manPowerStd?: true
    manPowerAct?: true
    cycleTimeStd?: true
    cycleTimeAct?: true
    cavityStd?: true
    cavityAct?: true
    inputMaterialQty?: true
    materialRunnerQty?: true
    materialPurgeQty?: true
    qtyPassOn?: true
    qtyHold?: true
    qtyWip?: true
    qtyGood?: true
    qtyReject?: true
    rejectBreakdown?: true
    downtimeBreakdown?: true
    totalDowntime?: true
    notes?: true
    metaData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductionReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionReport to aggregate.
     */
    where?: ProductionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionReports to fetch.
     */
    orderBy?: ProductionReportOrderByWithRelationInput | ProductionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductionReports
    **/
    _count?: true | ProductionReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductionReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductionReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductionReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductionReportMaxAggregateInputType
  }

  export type GetProductionReportAggregateType<T extends ProductionReportAggregateArgs> = {
        [P in keyof T & keyof AggregateProductionReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductionReport[P]>
      : GetScalarType<T[P], AggregateProductionReport[P]>
  }




  export type ProductionReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionReportWhereInput
    orderBy?: ProductionReportOrderByWithAggregationInput | ProductionReportOrderByWithAggregationInput[]
    by: ProductionReportScalarFieldEnum[] | ProductionReportScalarFieldEnum
    having?: ProductionReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductionReportCountAggregateInputType | true
    _avg?: ProductionReportAvgAggregateInputType
    _sum?: ProductionReportSumAggregateInputType
    _min?: ProductionReportMinAggregateInputType
    _max?: ProductionReportMaxAggregateInputType
  }

  export type ProductionReportGroupByOutputType = {
    id: string
    proStepId: number
    reportDate: Date
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime: Date | null
    endTime: Date | null
    batchNo: string | null
    manPowerStd: number | null
    manPowerAct: number | null
    cycleTimeStd: Decimal | null
    cycleTimeAct: Decimal | null
    cavityStd: number | null
    cavityAct: number | null
    inputMaterialQty: Decimal | null
    materialRunnerQty: Decimal | null
    materialPurgeQty: Decimal | null
    qtyPassOn: Decimal | null
    qtyHold: Decimal | null
    qtyWip: Decimal | null
    qtyGood: Decimal
    qtyReject: Decimal
    rejectBreakdown: JsonValue | null
    downtimeBreakdown: JsonValue | null
    totalDowntime: number
    notes: string | null
    metaData: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ProductionReportCountAggregateOutputType | null
    _avg: ProductionReportAvgAggregateOutputType | null
    _sum: ProductionReportSumAggregateOutputType | null
    _min: ProductionReportMinAggregateOutputType | null
    _max: ProductionReportMaxAggregateOutputType | null
  }

  type GetProductionReportGroupByPayload<T extends ProductionReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductionReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductionReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductionReportGroupByOutputType[P]>
            : GetScalarType<T[P], ProductionReportGroupByOutputType[P]>
        }
      >
    >


  export type ProductionReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proStepId?: boolean
    reportDate?: boolean
    shift?: boolean
    operatorName?: boolean
    reportType?: boolean
    startTime?: boolean
    endTime?: boolean
    batchNo?: boolean
    manPowerStd?: boolean
    manPowerAct?: boolean
    cycleTimeStd?: boolean
    cycleTimeAct?: boolean
    cavityStd?: boolean
    cavityAct?: boolean
    inputMaterialQty?: boolean
    materialRunnerQty?: boolean
    materialPurgeQty?: boolean
    qtyPassOn?: boolean
    qtyHold?: boolean
    qtyWip?: boolean
    qtyGood?: boolean
    qtyReject?: boolean
    rejectBreakdown?: boolean
    downtimeBreakdown?: boolean
    totalDowntime?: boolean
    notes?: boolean
    metaData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    step?: boolean | ProStepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productionReport"]>



  export type ProductionReportSelectScalar = {
    id?: boolean
    proStepId?: boolean
    reportDate?: boolean
    shift?: boolean
    operatorName?: boolean
    reportType?: boolean
    startTime?: boolean
    endTime?: boolean
    batchNo?: boolean
    manPowerStd?: boolean
    manPowerAct?: boolean
    cycleTimeStd?: boolean
    cycleTimeAct?: boolean
    cavityStd?: boolean
    cavityAct?: boolean
    inputMaterialQty?: boolean
    materialRunnerQty?: boolean
    materialPurgeQty?: boolean
    qtyPassOn?: boolean
    qtyHold?: boolean
    qtyWip?: boolean
    qtyGood?: boolean
    qtyReject?: boolean
    rejectBreakdown?: boolean
    downtimeBreakdown?: boolean
    totalDowntime?: boolean
    notes?: boolean
    metaData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductionReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proStepId" | "reportDate" | "shift" | "operatorName" | "reportType" | "startTime" | "endTime" | "batchNo" | "manPowerStd" | "manPowerAct" | "cycleTimeStd" | "cycleTimeAct" | "cavityStd" | "cavityAct" | "inputMaterialQty" | "materialRunnerQty" | "materialPurgeQty" | "qtyPassOn" | "qtyHold" | "qtyWip" | "qtyGood" | "qtyReject" | "rejectBreakdown" | "downtimeBreakdown" | "totalDowntime" | "notes" | "metaData" | "createdAt" | "updatedAt", ExtArgs["result"]["productionReport"]>
  export type ProductionReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    step?: boolean | ProStepDefaultArgs<ExtArgs>
  }

  export type $ProductionReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductionReport"
    objects: {
      step: Prisma.$ProStepPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      proStepId: number
      reportDate: Date
      shift: number
      operatorName: string
      reportType: $Enums.LphType
      startTime: Date | null
      endTime: Date | null
      batchNo: string | null
      manPowerStd: number | null
      manPowerAct: number | null
      cycleTimeStd: Prisma.Decimal | null
      cycleTimeAct: Prisma.Decimal | null
      cavityStd: number | null
      cavityAct: number | null
      inputMaterialQty: Prisma.Decimal | null
      materialRunnerQty: Prisma.Decimal | null
      materialPurgeQty: Prisma.Decimal | null
      qtyPassOn: Prisma.Decimal | null
      qtyHold: Prisma.Decimal | null
      qtyWip: Prisma.Decimal | null
      qtyGood: Prisma.Decimal
      qtyReject: Prisma.Decimal
      rejectBreakdown: Prisma.JsonValue | null
      downtimeBreakdown: Prisma.JsonValue | null
      totalDowntime: number
      notes: string | null
      metaData: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["productionReport"]>
    composites: {}
  }

  type ProductionReportGetPayload<S extends boolean | null | undefined | ProductionReportDefaultArgs> = $Result.GetResult<Prisma.$ProductionReportPayload, S>

  type ProductionReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductionReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductionReportCountAggregateInputType | true
    }

  export interface ProductionReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductionReport'], meta: { name: 'ProductionReport' } }
    /**
     * Find zero or one ProductionReport that matches the filter.
     * @param {ProductionReportFindUniqueArgs} args - Arguments to find a ProductionReport
     * @example
     * // Get one ProductionReport
     * const productionReport = await prisma.productionReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductionReportFindUniqueArgs>(args: SelectSubset<T, ProductionReportFindUniqueArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductionReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductionReportFindUniqueOrThrowArgs} args - Arguments to find a ProductionReport
     * @example
     * // Get one ProductionReport
     * const productionReport = await prisma.productionReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductionReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductionReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductionReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportFindFirstArgs} args - Arguments to find a ProductionReport
     * @example
     * // Get one ProductionReport
     * const productionReport = await prisma.productionReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductionReportFindFirstArgs>(args?: SelectSubset<T, ProductionReportFindFirstArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductionReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportFindFirstOrThrowArgs} args - Arguments to find a ProductionReport
     * @example
     * // Get one ProductionReport
     * const productionReport = await prisma.productionReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductionReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductionReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductionReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductionReports
     * const productionReports = await prisma.productionReport.findMany()
     * 
     * // Get first 10 ProductionReports
     * const productionReports = await prisma.productionReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productionReportWithIdOnly = await prisma.productionReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductionReportFindManyArgs>(args?: SelectSubset<T, ProductionReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductionReport.
     * @param {ProductionReportCreateArgs} args - Arguments to create a ProductionReport.
     * @example
     * // Create one ProductionReport
     * const ProductionReport = await prisma.productionReport.create({
     *   data: {
     *     // ... data to create a ProductionReport
     *   }
     * })
     * 
     */
    create<T extends ProductionReportCreateArgs>(args: SelectSubset<T, ProductionReportCreateArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductionReports.
     * @param {ProductionReportCreateManyArgs} args - Arguments to create many ProductionReports.
     * @example
     * // Create many ProductionReports
     * const productionReport = await prisma.productionReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductionReportCreateManyArgs>(args?: SelectSubset<T, ProductionReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProductionReport.
     * @param {ProductionReportDeleteArgs} args - Arguments to delete one ProductionReport.
     * @example
     * // Delete one ProductionReport
     * const ProductionReport = await prisma.productionReport.delete({
     *   where: {
     *     // ... filter to delete one ProductionReport
     *   }
     * })
     * 
     */
    delete<T extends ProductionReportDeleteArgs>(args: SelectSubset<T, ProductionReportDeleteArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductionReport.
     * @param {ProductionReportUpdateArgs} args - Arguments to update one ProductionReport.
     * @example
     * // Update one ProductionReport
     * const productionReport = await prisma.productionReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductionReportUpdateArgs>(args: SelectSubset<T, ProductionReportUpdateArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductionReports.
     * @param {ProductionReportDeleteManyArgs} args - Arguments to filter ProductionReports to delete.
     * @example
     * // Delete a few ProductionReports
     * const { count } = await prisma.productionReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductionReportDeleteManyArgs>(args?: SelectSubset<T, ProductionReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductionReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductionReports
     * const productionReport = await prisma.productionReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductionReportUpdateManyArgs>(args: SelectSubset<T, ProductionReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductionReport.
     * @param {ProductionReportUpsertArgs} args - Arguments to update or create a ProductionReport.
     * @example
     * // Update or create a ProductionReport
     * const productionReport = await prisma.productionReport.upsert({
     *   create: {
     *     // ... data to create a ProductionReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductionReport we want to update
     *   }
     * })
     */
    upsert<T extends ProductionReportUpsertArgs>(args: SelectSubset<T, ProductionReportUpsertArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductionReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportCountArgs} args - Arguments to filter ProductionReports to count.
     * @example
     * // Count the number of ProductionReports
     * const count = await prisma.productionReport.count({
     *   where: {
     *     // ... the filter for the ProductionReports we want to count
     *   }
     * })
    **/
    count<T extends ProductionReportCountArgs>(
      args?: Subset<T, ProductionReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductionReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductionReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductionReportAggregateArgs>(args: Subset<T, ProductionReportAggregateArgs>): Prisma.PrismaPromise<GetProductionReportAggregateType<T>>

    /**
     * Group by ProductionReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductionReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductionReportGroupByArgs['orderBy'] }
        : { orderBy?: ProductionReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductionReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductionReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductionReport model
   */
  readonly fields: ProductionReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductionReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductionReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    step<T extends ProStepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProStepDefaultArgs<ExtArgs>>): Prisma__ProStepClient<$Result.GetResult<Prisma.$ProStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductionReport model
   */
  interface ProductionReportFieldRefs {
    readonly id: FieldRef<"ProductionReport", 'String'>
    readonly proStepId: FieldRef<"ProductionReport", 'Int'>
    readonly reportDate: FieldRef<"ProductionReport", 'DateTime'>
    readonly shift: FieldRef<"ProductionReport", 'Int'>
    readonly operatorName: FieldRef<"ProductionReport", 'String'>
    readonly reportType: FieldRef<"ProductionReport", 'LphType'>
    readonly startTime: FieldRef<"ProductionReport", 'DateTime'>
    readonly endTime: FieldRef<"ProductionReport", 'DateTime'>
    readonly batchNo: FieldRef<"ProductionReport", 'String'>
    readonly manPowerStd: FieldRef<"ProductionReport", 'Int'>
    readonly manPowerAct: FieldRef<"ProductionReport", 'Int'>
    readonly cycleTimeStd: FieldRef<"ProductionReport", 'Decimal'>
    readonly cycleTimeAct: FieldRef<"ProductionReport", 'Decimal'>
    readonly cavityStd: FieldRef<"ProductionReport", 'Int'>
    readonly cavityAct: FieldRef<"ProductionReport", 'Int'>
    readonly inputMaterialQty: FieldRef<"ProductionReport", 'Decimal'>
    readonly materialRunnerQty: FieldRef<"ProductionReport", 'Decimal'>
    readonly materialPurgeQty: FieldRef<"ProductionReport", 'Decimal'>
    readonly qtyPassOn: FieldRef<"ProductionReport", 'Decimal'>
    readonly qtyHold: FieldRef<"ProductionReport", 'Decimal'>
    readonly qtyWip: FieldRef<"ProductionReport", 'Decimal'>
    readonly qtyGood: FieldRef<"ProductionReport", 'Decimal'>
    readonly qtyReject: FieldRef<"ProductionReport", 'Decimal'>
    readonly rejectBreakdown: FieldRef<"ProductionReport", 'Json'>
    readonly downtimeBreakdown: FieldRef<"ProductionReport", 'Json'>
    readonly totalDowntime: FieldRef<"ProductionReport", 'Int'>
    readonly notes: FieldRef<"ProductionReport", 'String'>
    readonly metaData: FieldRef<"ProductionReport", 'Json'>
    readonly createdAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductionReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductionReport findUnique
   */
  export type ProductionReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter, which ProductionReport to fetch.
     */
    where: ProductionReportWhereUniqueInput
  }

  /**
   * ProductionReport findUniqueOrThrow
   */
  export type ProductionReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter, which ProductionReport to fetch.
     */
    where: ProductionReportWhereUniqueInput
  }

  /**
   * ProductionReport findFirst
   */
  export type ProductionReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter, which ProductionReport to fetch.
     */
    where?: ProductionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionReports to fetch.
     */
    orderBy?: ProductionReportOrderByWithRelationInput | ProductionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionReports.
     */
    cursor?: ProductionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionReports.
     */
    distinct?: ProductionReportScalarFieldEnum | ProductionReportScalarFieldEnum[]
  }

  /**
   * ProductionReport findFirstOrThrow
   */
  export type ProductionReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter, which ProductionReport to fetch.
     */
    where?: ProductionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionReports to fetch.
     */
    orderBy?: ProductionReportOrderByWithRelationInput | ProductionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductionReports.
     */
    cursor?: ProductionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductionReports.
     */
    distinct?: ProductionReportScalarFieldEnum | ProductionReportScalarFieldEnum[]
  }

  /**
   * ProductionReport findMany
   */
  export type ProductionReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter, which ProductionReports to fetch.
     */
    where?: ProductionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductionReports to fetch.
     */
    orderBy?: ProductionReportOrderByWithRelationInput | ProductionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductionReports.
     */
    cursor?: ProductionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductionReports.
     */
    skip?: number
    distinct?: ProductionReportScalarFieldEnum | ProductionReportScalarFieldEnum[]
  }

  /**
   * ProductionReport create
   */
  export type ProductionReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductionReport.
     */
    data: XOR<ProductionReportCreateInput, ProductionReportUncheckedCreateInput>
  }

  /**
   * ProductionReport createMany
   */
  export type ProductionReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductionReports.
     */
    data: ProductionReportCreateManyInput | ProductionReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductionReport update
   */
  export type ProductionReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductionReport.
     */
    data: XOR<ProductionReportUpdateInput, ProductionReportUncheckedUpdateInput>
    /**
     * Choose, which ProductionReport to update.
     */
    where: ProductionReportWhereUniqueInput
  }

  /**
   * ProductionReport updateMany
   */
  export type ProductionReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductionReports.
     */
    data: XOR<ProductionReportUpdateManyMutationInput, ProductionReportUncheckedUpdateManyInput>
    /**
     * Filter which ProductionReports to update
     */
    where?: ProductionReportWhereInput
    /**
     * Limit how many ProductionReports to update.
     */
    limit?: number
  }

  /**
   * ProductionReport upsert
   */
  export type ProductionReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductionReport to update in case it exists.
     */
    where: ProductionReportWhereUniqueInput
    /**
     * In case the ProductionReport found by the `where` argument doesn't exist, create a new ProductionReport with this data.
     */
    create: XOR<ProductionReportCreateInput, ProductionReportUncheckedCreateInput>
    /**
     * In case the ProductionReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductionReportUpdateInput, ProductionReportUncheckedUpdateInput>
  }

  /**
   * ProductionReport delete
   */
  export type ProductionReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
    /**
     * Filter which ProductionReport to delete.
     */
    where: ProductionReportWhereUniqueInput
  }

  /**
   * ProductionReport deleteMany
   */
  export type ProductionReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionReports to delete
     */
    where?: ProductionReportWhereInput
    /**
     * Limit how many ProductionReports to delete.
     */
    limit?: number
  }

  /**
   * ProductionReport without action
   */
  export type ProductionReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReport
     */
    select?: ProductionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductionReport
     */
    omit?: ProductionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionReportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MachineScalarFieldEnum: {
    id: 'id',
    name: 'name',
    stdOutputPerHour: 'stdOutputPerHour',
    stdOutputPerShift: 'stdOutputPerShift',
    uom: 'uom',
    type: 'type',
    remark: 'remark',
    partNumber: 'partNumber',
    cycleTimeSec: 'cycleTimeSec',
    cycleTimeMin: 'cycleTimeMin',
    cavity: 'cavity',
    manPower: 'manPower',
    stdOutputPerDay: 'stdOutputPerDay',
    workCenter: 'workCenter',
    shortDesc: 'shortDesc',
    phase: 'phase',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MachineScalarFieldEnum = (typeof MachineScalarFieldEnum)[keyof typeof MachineScalarFieldEnum]


  export const MaterialScalarFieldEnum: {
    id: 'id',
    name: 'name',
    uom: 'uom',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MaterialScalarFieldEnum = (typeof MaterialScalarFieldEnum)[keyof typeof MaterialScalarFieldEnum]


  export const ProcessScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    type: 'type'
  };

  export type ProcessScalarFieldEnum = (typeof ProcessScalarFieldEnum)[keyof typeof ProcessScalarFieldEnum]


  export const ProSequenceScalarFieldEnum: {
    prefix: 'prefix',
    last: 'last'
  };

  export type ProSequenceScalarFieldEnum = (typeof ProSequenceScalarFieldEnum)[keyof typeof ProSequenceScalarFieldEnum]


  export const ProScalarFieldEnum: {
    id: 'id',
    proNumber: 'proNumber',
    productName: 'productName',
    qtyPoPcs: 'qtyPoPcs',
    startDate: 'startDate',
    status: 'status',
    type: 'type',
    autoShiftExpansion: 'autoShiftExpansion',
    processId: 'processId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProScalarFieldEnum = (typeof ProScalarFieldEnum)[keyof typeof ProScalarFieldEnum]


  export const ProStepScalarFieldEnum: {
    id: 'id',
    proId: 'proId',
    orderNo: 'orderNo',
    up: 'up',
    estimatedShifts: 'estimatedShifts',
    startDate: 'startDate',
    machineId: 'machineId',
    partNumber: 'partNumber',
    manPowerStd: 'manPowerStd',
    cycleTimeStd: 'cycleTimeStd',
    cavityStd: 'cavityStd'
  };

  export type ProStepScalarFieldEnum = (typeof ProStepScalarFieldEnum)[keyof typeof ProStepScalarFieldEnum]


  export const ProStepMaterialScalarFieldEnum: {
    id: 'id',
    stepId: 'stepId',
    materialId: 'materialId',
    qtyReq: 'qtyReq'
  };

  export type ProStepMaterialScalarFieldEnum = (typeof ProStepMaterialScalarFieldEnum)[keyof typeof ProStepMaterialScalarFieldEnum]


  export const ProductionReportScalarFieldEnum: {
    id: 'id',
    proStepId: 'proStepId',
    reportDate: 'reportDate',
    shift: 'shift',
    operatorName: 'operatorName',
    reportType: 'reportType',
    startTime: 'startTime',
    endTime: 'endTime',
    batchNo: 'batchNo',
    manPowerStd: 'manPowerStd',
    manPowerAct: 'manPowerAct',
    cycleTimeStd: 'cycleTimeStd',
    cycleTimeAct: 'cycleTimeAct',
    cavityStd: 'cavityStd',
    cavityAct: 'cavityAct',
    inputMaterialQty: 'inputMaterialQty',
    materialRunnerQty: 'materialRunnerQty',
    materialPurgeQty: 'materialPurgeQty',
    qtyPassOn: 'qtyPassOn',
    qtyHold: 'qtyHold',
    qtyWip: 'qtyWip',
    qtyGood: 'qtyGood',
    qtyReject: 'qtyReject',
    rejectBreakdown: 'rejectBreakdown',
    downtimeBreakdown: 'downtimeBreakdown',
    totalDowntime: 'totalDowntime',
    notes: 'notes',
    metaData: 'metaData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductionReportScalarFieldEnum = (typeof ProductionReportScalarFieldEnum)[keyof typeof ProductionReportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    username: 'username',
    passwordHash: 'passwordHash'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const MachineOrderByRelevanceFieldEnum: {
    name: 'name',
    remark: 'remark',
    partNumber: 'partNumber',
    workCenter: 'workCenter',
    shortDesc: 'shortDesc',
    phase: 'phase'
  };

  export type MachineOrderByRelevanceFieldEnum = (typeof MachineOrderByRelevanceFieldEnum)[keyof typeof MachineOrderByRelevanceFieldEnum]


  export const MaterialOrderByRelevanceFieldEnum: {
    name: 'name',
    uom: 'uom'
  };

  export type MaterialOrderByRelevanceFieldEnum = (typeof MaterialOrderByRelevanceFieldEnum)[keyof typeof MaterialOrderByRelevanceFieldEnum]


  export const ProcessOrderByRelevanceFieldEnum: {
    code: 'code',
    name: 'name'
  };

  export type ProcessOrderByRelevanceFieldEnum = (typeof ProcessOrderByRelevanceFieldEnum)[keyof typeof ProcessOrderByRelevanceFieldEnum]


  export const ProSequenceOrderByRelevanceFieldEnum: {
    prefix: 'prefix'
  };

  export type ProSequenceOrderByRelevanceFieldEnum = (typeof ProSequenceOrderByRelevanceFieldEnum)[keyof typeof ProSequenceOrderByRelevanceFieldEnum]


  export const ProOrderByRelevanceFieldEnum: {
    proNumber: 'proNumber',
    productName: 'productName'
  };

  export type ProOrderByRelevanceFieldEnum = (typeof ProOrderByRelevanceFieldEnum)[keyof typeof ProOrderByRelevanceFieldEnum]


  export const ProStepOrderByRelevanceFieldEnum: {
    partNumber: 'partNumber'
  };

  export type ProStepOrderByRelevanceFieldEnum = (typeof ProStepOrderByRelevanceFieldEnum)[keyof typeof ProStepOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const ProductionReportOrderByRelevanceFieldEnum: {
    id: 'id',
    operatorName: 'operatorName',
    batchNo: 'batchNo',
    notes: 'notes'
  };

  export type ProductionReportOrderByRelevanceFieldEnum = (typeof ProductionReportOrderByRelevanceFieldEnum)[keyof typeof ProductionReportOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Uom'
   */
  export type EnumUomFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Uom'>
    


  /**
   * Reference to a field of type 'MachineType'
   */
  export type EnumMachineTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MachineType'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'ProType'
   */
  export type EnumProTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProType'>
    


  /**
   * Reference to a field of type 'ProStatus'
   */
  export type EnumProStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProStatus'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'LphType'
   */
  export type EnumLphTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LphType'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MachineWhereInput = {
    AND?: MachineWhereInput | MachineWhereInput[]
    OR?: MachineWhereInput[]
    NOT?: MachineWhereInput | MachineWhereInput[]
    id?: IntFilter<"Machine"> | number
    name?: StringFilter<"Machine"> | string
    stdOutputPerHour?: IntFilter<"Machine"> | number
    stdOutputPerShift?: IntFilter<"Machine"> | number
    uom?: EnumUomFilter<"Machine"> | $Enums.Uom
    type?: EnumMachineTypeFilter<"Machine"> | $Enums.MachineType
    remark?: StringNullableFilter<"Machine"> | string | null
    partNumber?: StringNullableFilter<"Machine"> | string | null
    cycleTimeSec?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableFilter<"Machine"> | number | null
    manPower?: IntNullableFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableFilter<"Machine"> | number | null
    workCenter?: StringNullableFilter<"Machine"> | string | null
    shortDesc?: StringNullableFilter<"Machine"> | string | null
    phase?: StringNullableFilter<"Machine"> | string | null
    createdAt?: DateTimeFilter<"Machine"> | Date | string
    updatedAt?: DateTimeFilter<"Machine"> | Date | string
    proSteps?: ProStepListRelationFilter
  }

  export type MachineOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    cycleTimeSec?: SortOrderInput | SortOrder
    cycleTimeMin?: SortOrderInput | SortOrder
    cavity?: SortOrderInput | SortOrder
    manPower?: SortOrderInput | SortOrder
    stdOutputPerDay?: SortOrderInput | SortOrder
    workCenter?: SortOrderInput | SortOrder
    shortDesc?: SortOrderInput | SortOrder
    phase?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    proSteps?: ProStepOrderByRelationAggregateInput
    _relevance?: MachineOrderByRelevanceInput
  }

  export type MachineWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MachineWhereInput | MachineWhereInput[]
    OR?: MachineWhereInput[]
    NOT?: MachineWhereInput | MachineWhereInput[]
    name?: StringFilter<"Machine"> | string
    stdOutputPerHour?: IntFilter<"Machine"> | number
    stdOutputPerShift?: IntFilter<"Machine"> | number
    uom?: EnumUomFilter<"Machine"> | $Enums.Uom
    type?: EnumMachineTypeFilter<"Machine"> | $Enums.MachineType
    remark?: StringNullableFilter<"Machine"> | string | null
    partNumber?: StringNullableFilter<"Machine"> | string | null
    cycleTimeSec?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableFilter<"Machine"> | number | null
    manPower?: IntNullableFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableFilter<"Machine"> | number | null
    workCenter?: StringNullableFilter<"Machine"> | string | null
    shortDesc?: StringNullableFilter<"Machine"> | string | null
    phase?: StringNullableFilter<"Machine"> | string | null
    createdAt?: DateTimeFilter<"Machine"> | Date | string
    updatedAt?: DateTimeFilter<"Machine"> | Date | string
    proSteps?: ProStepListRelationFilter
  }, "id">

  export type MachineOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    cycleTimeSec?: SortOrderInput | SortOrder
    cycleTimeMin?: SortOrderInput | SortOrder
    cavity?: SortOrderInput | SortOrder
    manPower?: SortOrderInput | SortOrder
    stdOutputPerDay?: SortOrderInput | SortOrder
    workCenter?: SortOrderInput | SortOrder
    shortDesc?: SortOrderInput | SortOrder
    phase?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MachineCountOrderByAggregateInput
    _avg?: MachineAvgOrderByAggregateInput
    _max?: MachineMaxOrderByAggregateInput
    _min?: MachineMinOrderByAggregateInput
    _sum?: MachineSumOrderByAggregateInput
  }

  export type MachineScalarWhereWithAggregatesInput = {
    AND?: MachineScalarWhereWithAggregatesInput | MachineScalarWhereWithAggregatesInput[]
    OR?: MachineScalarWhereWithAggregatesInput[]
    NOT?: MachineScalarWhereWithAggregatesInput | MachineScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Machine"> | number
    name?: StringWithAggregatesFilter<"Machine"> | string
    stdOutputPerHour?: IntWithAggregatesFilter<"Machine"> | number
    stdOutputPerShift?: IntWithAggregatesFilter<"Machine"> | number
    uom?: EnumUomWithAggregatesFilter<"Machine"> | $Enums.Uom
    type?: EnumMachineTypeWithAggregatesFilter<"Machine"> | $Enums.MachineType
    remark?: StringNullableWithAggregatesFilter<"Machine"> | string | null
    partNumber?: StringNullableWithAggregatesFilter<"Machine"> | string | null
    cycleTimeSec?: DecimalNullableWithAggregatesFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableWithAggregatesFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    manPower?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    workCenter?: StringNullableWithAggregatesFilter<"Machine"> | string | null
    shortDesc?: StringNullableWithAggregatesFilter<"Machine"> | string | null
    phase?: StringNullableWithAggregatesFilter<"Machine"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Machine"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Machine"> | Date | string
  }

  export type MaterialWhereInput = {
    AND?: MaterialWhereInput | MaterialWhereInput[]
    OR?: MaterialWhereInput[]
    NOT?: MaterialWhereInput | MaterialWhereInput[]
    id?: IntFilter<"Material"> | number
    name?: StringFilter<"Material"> | string
    uom?: StringFilter<"Material"> | string
    createdAt?: DateTimeFilter<"Material"> | Date | string
    updatedAt?: DateTimeFilter<"Material"> | Date | string
    proStepMaterials?: ProStepMaterialListRelationFilter
  }

  export type MaterialOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    proStepMaterials?: ProStepMaterialOrderByRelationAggregateInput
    _relevance?: MaterialOrderByRelevanceInput
  }

  export type MaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: MaterialWhereInput | MaterialWhereInput[]
    OR?: MaterialWhereInput[]
    NOT?: MaterialWhereInput | MaterialWhereInput[]
    uom?: StringFilter<"Material"> | string
    createdAt?: DateTimeFilter<"Material"> | Date | string
    updatedAt?: DateTimeFilter<"Material"> | Date | string
    proStepMaterials?: ProStepMaterialListRelationFilter
  }, "id" | "name">

  export type MaterialOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MaterialCountOrderByAggregateInput
    _avg?: MaterialAvgOrderByAggregateInput
    _max?: MaterialMaxOrderByAggregateInput
    _min?: MaterialMinOrderByAggregateInput
    _sum?: MaterialSumOrderByAggregateInput
  }

  export type MaterialScalarWhereWithAggregatesInput = {
    AND?: MaterialScalarWhereWithAggregatesInput | MaterialScalarWhereWithAggregatesInput[]
    OR?: MaterialScalarWhereWithAggregatesInput[]
    NOT?: MaterialScalarWhereWithAggregatesInput | MaterialScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Material"> | number
    name?: StringWithAggregatesFilter<"Material"> | string
    uom?: StringWithAggregatesFilter<"Material"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Material"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Material"> | Date | string
  }

  export type ProcessWhereInput = {
    AND?: ProcessWhereInput | ProcessWhereInput[]
    OR?: ProcessWhereInput[]
    NOT?: ProcessWhereInput | ProcessWhereInput[]
    id?: IntFilter<"Process"> | number
    code?: StringFilter<"Process"> | string
    name?: StringFilter<"Process"> | string
    type?: EnumProTypeFilter<"Process"> | $Enums.ProType
    pros?: ProListRelationFilter
  }

  export type ProcessOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    pros?: ProOrderByRelationAggregateInput
    _relevance?: ProcessOrderByRelevanceInput
  }

  export type ProcessWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    name?: string
    AND?: ProcessWhereInput | ProcessWhereInput[]
    OR?: ProcessWhereInput[]
    NOT?: ProcessWhereInput | ProcessWhereInput[]
    type?: EnumProTypeFilter<"Process"> | $Enums.ProType
    pros?: ProListRelationFilter
  }, "id" | "code" | "name">

  export type ProcessOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    _count?: ProcessCountOrderByAggregateInput
    _avg?: ProcessAvgOrderByAggregateInput
    _max?: ProcessMaxOrderByAggregateInput
    _min?: ProcessMinOrderByAggregateInput
    _sum?: ProcessSumOrderByAggregateInput
  }

  export type ProcessScalarWhereWithAggregatesInput = {
    AND?: ProcessScalarWhereWithAggregatesInput | ProcessScalarWhereWithAggregatesInput[]
    OR?: ProcessScalarWhereWithAggregatesInput[]
    NOT?: ProcessScalarWhereWithAggregatesInput | ProcessScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Process"> | number
    code?: StringWithAggregatesFilter<"Process"> | string
    name?: StringWithAggregatesFilter<"Process"> | string
    type?: EnumProTypeWithAggregatesFilter<"Process"> | $Enums.ProType
  }

  export type ProSequenceWhereInput = {
    AND?: ProSequenceWhereInput | ProSequenceWhereInput[]
    OR?: ProSequenceWhereInput[]
    NOT?: ProSequenceWhereInput | ProSequenceWhereInput[]
    prefix?: StringFilter<"ProSequence"> | string
    last?: IntFilter<"ProSequence"> | number
  }

  export type ProSequenceOrderByWithRelationInput = {
    prefix?: SortOrder
    last?: SortOrder
    _relevance?: ProSequenceOrderByRelevanceInput
  }

  export type ProSequenceWhereUniqueInput = Prisma.AtLeast<{
    prefix?: string
    AND?: ProSequenceWhereInput | ProSequenceWhereInput[]
    OR?: ProSequenceWhereInput[]
    NOT?: ProSequenceWhereInput | ProSequenceWhereInput[]
    last?: IntFilter<"ProSequence"> | number
  }, "prefix">

  export type ProSequenceOrderByWithAggregationInput = {
    prefix?: SortOrder
    last?: SortOrder
    _count?: ProSequenceCountOrderByAggregateInput
    _avg?: ProSequenceAvgOrderByAggregateInput
    _max?: ProSequenceMaxOrderByAggregateInput
    _min?: ProSequenceMinOrderByAggregateInput
    _sum?: ProSequenceSumOrderByAggregateInput
  }

  export type ProSequenceScalarWhereWithAggregatesInput = {
    AND?: ProSequenceScalarWhereWithAggregatesInput | ProSequenceScalarWhereWithAggregatesInput[]
    OR?: ProSequenceScalarWhereWithAggregatesInput[]
    NOT?: ProSequenceScalarWhereWithAggregatesInput | ProSequenceScalarWhereWithAggregatesInput[]
    prefix?: StringWithAggregatesFilter<"ProSequence"> | string
    last?: IntWithAggregatesFilter<"ProSequence"> | number
  }

  export type ProWhereInput = {
    AND?: ProWhereInput | ProWhereInput[]
    OR?: ProWhereInput[]
    NOT?: ProWhereInput | ProWhereInput[]
    id?: IntFilter<"Pro"> | number
    proNumber?: StringFilter<"Pro"> | string
    productName?: StringFilter<"Pro"> | string
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    processId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
    process?: XOR<ProcessNullableScalarRelationFilter, ProcessWhereInput> | null
    steps?: ProStepListRelationFilter
  }

  export type ProOrderByWithRelationInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    processId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    process?: ProcessOrderByWithRelationInput
    steps?: ProStepOrderByRelationAggregateInput
    _relevance?: ProOrderByRelevanceInput
  }

  export type ProWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    proNumber?: string
    AND?: ProWhereInput | ProWhereInput[]
    OR?: ProWhereInput[]
    NOT?: ProWhereInput | ProWhereInput[]
    productName?: StringFilter<"Pro"> | string
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    processId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
    process?: XOR<ProcessNullableScalarRelationFilter, ProcessWhereInput> | null
    steps?: ProStepListRelationFilter
  }, "id" | "proNumber">

  export type ProOrderByWithAggregationInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    processId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProCountOrderByAggregateInput
    _avg?: ProAvgOrderByAggregateInput
    _max?: ProMaxOrderByAggregateInput
    _min?: ProMinOrderByAggregateInput
    _sum?: ProSumOrderByAggregateInput
  }

  export type ProScalarWhereWithAggregatesInput = {
    AND?: ProScalarWhereWithAggregatesInput | ProScalarWhereWithAggregatesInput[]
    OR?: ProScalarWhereWithAggregatesInput[]
    NOT?: ProScalarWhereWithAggregatesInput | ProScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Pro"> | number
    proNumber?: StringWithAggregatesFilter<"Pro"> | string
    productName?: StringWithAggregatesFilter<"Pro"> | string
    qtyPoPcs?: IntWithAggregatesFilter<"Pro"> | number
    startDate?: DateTimeNullableWithAggregatesFilter<"Pro"> | Date | string | null
    status?: EnumProStatusWithAggregatesFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeWithAggregatesFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolWithAggregatesFilter<"Pro"> | boolean
    processId?: IntNullableWithAggregatesFilter<"Pro"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Pro"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pro"> | Date | string
  }

  export type ProStepWhereInput = {
    AND?: ProStepWhereInput | ProStepWhereInput[]
    OR?: ProStepWhereInput[]
    NOT?: ProStepWhereInput | ProStepWhereInput[]
    id?: IntFilter<"ProStep"> | number
    proId?: IntFilter<"ProStep"> | number
    orderNo?: IntFilter<"ProStep"> | number
    up?: IntNullableFilter<"ProStep"> | number | null
    estimatedShifts?: IntNullableFilter<"ProStep"> | number | null
    startDate?: DateTimeNullableFilter<"ProStep"> | Date | string | null
    machineId?: IntNullableFilter<"ProStep"> | number | null
    partNumber?: StringNullableFilter<"ProStep"> | string | null
    manPowerStd?: IntNullableFilter<"ProStep"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProStep"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProStep"> | number | null
    pro?: XOR<ProScalarRelationFilter, ProWhereInput>
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    materials?: ProStepMaterialListRelationFilter
    productionReports?: ProductionReportListRelationFilter
  }

  export type ProStepOrderByWithRelationInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrderInput | SortOrder
    estimatedShifts?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    machineId?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    manPowerStd?: SortOrderInput | SortOrder
    cycleTimeStd?: SortOrderInput | SortOrder
    cavityStd?: SortOrderInput | SortOrder
    pro?: ProOrderByWithRelationInput
    machine?: MachineOrderByWithRelationInput
    materials?: ProStepMaterialOrderByRelationAggregateInput
    productionReports?: ProductionReportOrderByRelationAggregateInput
    _relevance?: ProStepOrderByRelevanceInput
  }

  export type ProStepWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    proId_orderNo?: ProStepProIdOrderNoCompoundUniqueInput
    AND?: ProStepWhereInput | ProStepWhereInput[]
    OR?: ProStepWhereInput[]
    NOT?: ProStepWhereInput | ProStepWhereInput[]
    proId?: IntFilter<"ProStep"> | number
    orderNo?: IntFilter<"ProStep"> | number
    up?: IntNullableFilter<"ProStep"> | number | null
    estimatedShifts?: IntNullableFilter<"ProStep"> | number | null
    startDate?: DateTimeNullableFilter<"ProStep"> | Date | string | null
    machineId?: IntNullableFilter<"ProStep"> | number | null
    partNumber?: StringNullableFilter<"ProStep"> | string | null
    manPowerStd?: IntNullableFilter<"ProStep"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProStep"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProStep"> | number | null
    pro?: XOR<ProScalarRelationFilter, ProWhereInput>
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    materials?: ProStepMaterialListRelationFilter
    productionReports?: ProductionReportListRelationFilter
  }, "id" | "proId_orderNo">

  export type ProStepOrderByWithAggregationInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrderInput | SortOrder
    estimatedShifts?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    machineId?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    manPowerStd?: SortOrderInput | SortOrder
    cycleTimeStd?: SortOrderInput | SortOrder
    cavityStd?: SortOrderInput | SortOrder
    _count?: ProStepCountOrderByAggregateInput
    _avg?: ProStepAvgOrderByAggregateInput
    _max?: ProStepMaxOrderByAggregateInput
    _min?: ProStepMinOrderByAggregateInput
    _sum?: ProStepSumOrderByAggregateInput
  }

  export type ProStepScalarWhereWithAggregatesInput = {
    AND?: ProStepScalarWhereWithAggregatesInput | ProStepScalarWhereWithAggregatesInput[]
    OR?: ProStepScalarWhereWithAggregatesInput[]
    NOT?: ProStepScalarWhereWithAggregatesInput | ProStepScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProStep"> | number
    proId?: IntWithAggregatesFilter<"ProStep"> | number
    orderNo?: IntWithAggregatesFilter<"ProStep"> | number
    up?: IntNullableWithAggregatesFilter<"ProStep"> | number | null
    estimatedShifts?: IntNullableWithAggregatesFilter<"ProStep"> | number | null
    startDate?: DateTimeNullableWithAggregatesFilter<"ProStep"> | Date | string | null
    machineId?: IntNullableWithAggregatesFilter<"ProStep"> | number | null
    partNumber?: StringNullableWithAggregatesFilter<"ProStep"> | string | null
    manPowerStd?: IntNullableWithAggregatesFilter<"ProStep"> | number | null
    cycleTimeStd?: DecimalNullableWithAggregatesFilter<"ProStep"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableWithAggregatesFilter<"ProStep"> | number | null
  }

  export type ProStepMaterialWhereInput = {
    AND?: ProStepMaterialWhereInput | ProStepMaterialWhereInput[]
    OR?: ProStepMaterialWhereInput[]
    NOT?: ProStepMaterialWhereInput | ProStepMaterialWhereInput[]
    id?: IntFilter<"ProStepMaterial"> | number
    stepId?: IntFilter<"ProStepMaterial"> | number
    materialId?: IntFilter<"ProStepMaterial"> | number
    qtyReq?: DecimalFilter<"ProStepMaterial"> | Decimal | DecimalJsLike | number | string
    step?: XOR<ProStepScalarRelationFilter, ProStepWhereInput>
    material?: XOR<MaterialScalarRelationFilter, MaterialWhereInput>
  }

  export type ProStepMaterialOrderByWithRelationInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
    step?: ProStepOrderByWithRelationInput
    material?: MaterialOrderByWithRelationInput
  }

  export type ProStepMaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    stepId_materialId?: ProStepMaterialStepIdMaterialIdCompoundUniqueInput
    AND?: ProStepMaterialWhereInput | ProStepMaterialWhereInput[]
    OR?: ProStepMaterialWhereInput[]
    NOT?: ProStepMaterialWhereInput | ProStepMaterialWhereInput[]
    stepId?: IntFilter<"ProStepMaterial"> | number
    materialId?: IntFilter<"ProStepMaterial"> | number
    qtyReq?: DecimalFilter<"ProStepMaterial"> | Decimal | DecimalJsLike | number | string
    step?: XOR<ProStepScalarRelationFilter, ProStepWhereInput>
    material?: XOR<MaterialScalarRelationFilter, MaterialWhereInput>
  }, "id" | "stepId_materialId">

  export type ProStepMaterialOrderByWithAggregationInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
    _count?: ProStepMaterialCountOrderByAggregateInput
    _avg?: ProStepMaterialAvgOrderByAggregateInput
    _max?: ProStepMaterialMaxOrderByAggregateInput
    _min?: ProStepMaterialMinOrderByAggregateInput
    _sum?: ProStepMaterialSumOrderByAggregateInput
  }

  export type ProStepMaterialScalarWhereWithAggregatesInput = {
    AND?: ProStepMaterialScalarWhereWithAggregatesInput | ProStepMaterialScalarWhereWithAggregatesInput[]
    OR?: ProStepMaterialScalarWhereWithAggregatesInput[]
    NOT?: ProStepMaterialScalarWhereWithAggregatesInput | ProStepMaterialScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProStepMaterial"> | number
    stepId?: IntWithAggregatesFilter<"ProStepMaterial"> | number
    materialId?: IntWithAggregatesFilter<"ProStepMaterial"> | number
    qtyReq?: DecimalWithAggregatesFilter<"ProStepMaterial"> | Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportWhereInput = {
    AND?: ProductionReportWhereInput | ProductionReportWhereInput[]
    OR?: ProductionReportWhereInput[]
    NOT?: ProductionReportWhereInput | ProductionReportWhereInput[]
    id?: StringFilter<"ProductionReport"> | string
    proStepId?: IntFilter<"ProductionReport"> | number
    reportDate?: DateTimeFilter<"ProductionReport"> | Date | string
    shift?: IntFilter<"ProductionReport"> | number
    operatorName?: StringFilter<"ProductionReport"> | string
    reportType?: EnumLphTypeFilter<"ProductionReport"> | $Enums.LphType
    startTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    endTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    batchNo?: StringNullableFilter<"ProductionReport"> | string | null
    manPowerStd?: IntNullableFilter<"ProductionReport"> | number | null
    manPowerAct?: IntNullableFilter<"ProductionReport"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProductionReport"> | number | null
    cavityAct?: IntNullableFilter<"ProductionReport"> | number | null
    inputMaterialQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyHold?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyWip?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
    step?: XOR<ProStepScalarRelationFilter, ProStepWhereInput>
  }

  export type ProductionReportOrderByWithRelationInput = {
    id?: SortOrder
    proStepId?: SortOrder
    reportDate?: SortOrder
    shift?: SortOrder
    operatorName?: SortOrder
    reportType?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    batchNo?: SortOrderInput | SortOrder
    manPowerStd?: SortOrderInput | SortOrder
    manPowerAct?: SortOrderInput | SortOrder
    cycleTimeStd?: SortOrderInput | SortOrder
    cycleTimeAct?: SortOrderInput | SortOrder
    cavityStd?: SortOrderInput | SortOrder
    cavityAct?: SortOrderInput | SortOrder
    inputMaterialQty?: SortOrderInput | SortOrder
    materialRunnerQty?: SortOrderInput | SortOrder
    materialPurgeQty?: SortOrderInput | SortOrder
    qtyPassOn?: SortOrderInput | SortOrder
    qtyHold?: SortOrderInput | SortOrder
    qtyWip?: SortOrderInput | SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrderInput | SortOrder
    downtimeBreakdown?: SortOrderInput | SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrderInput | SortOrder
    metaData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    step?: ProStepOrderByWithRelationInput
    _relevance?: ProductionReportOrderByRelevanceInput
  }

  export type ProductionReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductionReportWhereInput | ProductionReportWhereInput[]
    OR?: ProductionReportWhereInput[]
    NOT?: ProductionReportWhereInput | ProductionReportWhereInput[]
    proStepId?: IntFilter<"ProductionReport"> | number
    reportDate?: DateTimeFilter<"ProductionReport"> | Date | string
    shift?: IntFilter<"ProductionReport"> | number
    operatorName?: StringFilter<"ProductionReport"> | string
    reportType?: EnumLphTypeFilter<"ProductionReport"> | $Enums.LphType
    startTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    endTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    batchNo?: StringNullableFilter<"ProductionReport"> | string | null
    manPowerStd?: IntNullableFilter<"ProductionReport"> | number | null
    manPowerAct?: IntNullableFilter<"ProductionReport"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProductionReport"> | number | null
    cavityAct?: IntNullableFilter<"ProductionReport"> | number | null
    inputMaterialQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyHold?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyWip?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
    step?: XOR<ProStepScalarRelationFilter, ProStepWhereInput>
  }, "id">

  export type ProductionReportOrderByWithAggregationInput = {
    id?: SortOrder
    proStepId?: SortOrder
    reportDate?: SortOrder
    shift?: SortOrder
    operatorName?: SortOrder
    reportType?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    batchNo?: SortOrderInput | SortOrder
    manPowerStd?: SortOrderInput | SortOrder
    manPowerAct?: SortOrderInput | SortOrder
    cycleTimeStd?: SortOrderInput | SortOrder
    cycleTimeAct?: SortOrderInput | SortOrder
    cavityStd?: SortOrderInput | SortOrder
    cavityAct?: SortOrderInput | SortOrder
    inputMaterialQty?: SortOrderInput | SortOrder
    materialRunnerQty?: SortOrderInput | SortOrder
    materialPurgeQty?: SortOrderInput | SortOrder
    qtyPassOn?: SortOrderInput | SortOrder
    qtyHold?: SortOrderInput | SortOrder
    qtyWip?: SortOrderInput | SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrderInput | SortOrder
    downtimeBreakdown?: SortOrderInput | SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrderInput | SortOrder
    metaData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductionReportCountOrderByAggregateInput
    _avg?: ProductionReportAvgOrderByAggregateInput
    _max?: ProductionReportMaxOrderByAggregateInput
    _min?: ProductionReportMinOrderByAggregateInput
    _sum?: ProductionReportSumOrderByAggregateInput
  }

  export type ProductionReportScalarWhereWithAggregatesInput = {
    AND?: ProductionReportScalarWhereWithAggregatesInput | ProductionReportScalarWhereWithAggregatesInput[]
    OR?: ProductionReportScalarWhereWithAggregatesInput[]
    NOT?: ProductionReportScalarWhereWithAggregatesInput | ProductionReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductionReport"> | string
    proStepId?: IntWithAggregatesFilter<"ProductionReport"> | number
    reportDate?: DateTimeWithAggregatesFilter<"ProductionReport"> | Date | string
    shift?: IntWithAggregatesFilter<"ProductionReport"> | number
    operatorName?: StringWithAggregatesFilter<"ProductionReport"> | string
    reportType?: EnumLphTypeWithAggregatesFilter<"ProductionReport"> | $Enums.LphType
    startTime?: DateTimeNullableWithAggregatesFilter<"ProductionReport"> | Date | string | null
    endTime?: DateTimeNullableWithAggregatesFilter<"ProductionReport"> | Date | string | null
    batchNo?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    manPowerStd?: IntNullableWithAggregatesFilter<"ProductionReport"> | number | null
    manPowerAct?: IntNullableWithAggregatesFilter<"ProductionReport"> | number | null
    cycleTimeStd?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableWithAggregatesFilter<"ProductionReport"> | number | null
    cavityAct?: IntNullableWithAggregatesFilter<"ProductionReport"> | number | null
    inputMaterialQty?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyHold?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyWip?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableWithAggregatesFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableWithAggregatesFilter<"ProductionReport">
    totalDowntime?: IntWithAggregatesFilter<"ProductionReport"> | number
    notes?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableWithAggregatesFilter<"ProductionReport">
    createdAt?: DateTimeWithAggregatesFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductionReport"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MachineCreateInput = {
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    partNumber?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    shortDesc?: string | null
    phase?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proSteps?: ProStepCreateNestedManyWithoutMachineInput
  }

  export type MachineUncheckedCreateInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    partNumber?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    shortDesc?: string | null
    phase?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proSteps?: ProStepUncheckedCreateNestedManyWithoutMachineInput
  }

  export type MachineUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proSteps?: ProStepUpdateManyWithoutMachineNestedInput
  }

  export type MachineUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proSteps?: ProStepUncheckedUpdateManyWithoutMachineNestedInput
  }

  export type MachineCreateManyInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    partNumber?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    shortDesc?: string | null
    phase?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MachineUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MachineUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaterialCreateInput = {
    name: string
    uom: string
    createdAt?: Date | string
    updatedAt?: Date | string
    proStepMaterials?: ProStepMaterialCreateNestedManyWithoutMaterialInput
  }

  export type MaterialUncheckedCreateInput = {
    id?: number
    name: string
    uom: string
    createdAt?: Date | string
    updatedAt?: Date | string
    proStepMaterials?: ProStepMaterialUncheckedCreateNestedManyWithoutMaterialInput
  }

  export type MaterialUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proStepMaterials?: ProStepMaterialUpdateManyWithoutMaterialNestedInput
  }

  export type MaterialUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proStepMaterials?: ProStepMaterialUncheckedUpdateManyWithoutMaterialNestedInput
  }

  export type MaterialCreateManyInput = {
    id?: number
    name: string
    uom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaterialUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaterialUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessCreateInput = {
    code: string
    name: string
    type?: $Enums.ProType
    pros?: ProCreateNestedManyWithoutProcessInput
  }

  export type ProcessUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
    pros?: ProUncheckedCreateNestedManyWithoutProcessInput
  }

  export type ProcessUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    pros?: ProUpdateManyWithoutProcessNestedInput
  }

  export type ProcessUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    pros?: ProUncheckedUpdateManyWithoutProcessNestedInput
  }

  export type ProcessCreateManyInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProcessUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProcessUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProSequenceCreateInput = {
    prefix: string
    last: number
  }

  export type ProSequenceUncheckedCreateInput = {
    prefix: string
    last: number
  }

  export type ProSequenceUpdateInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    last?: IntFieldUpdateOperationsInput | number
  }

  export type ProSequenceUncheckedUpdateInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    last?: IntFieldUpdateOperationsInput | number
  }

  export type ProSequenceCreateManyInput = {
    prefix: string
    last: number
  }

  export type ProSequenceUpdateManyMutationInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    last?: IntFieldUpdateOperationsInput | number
  }

  export type ProSequenceUncheckedUpdateManyInput = {
    prefix?: StringFieldUpdateOperationsInput | string
    last?: IntFieldUpdateOperationsInput | number
  }

  export type ProCreateInput = {
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    process?: ProcessCreateNestedOneWithoutProsInput
    steps?: ProStepCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateInput = {
    id?: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    processId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ProStepUncheckedCreateNestedManyWithoutProInput
  }

  export type ProUpdateInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    process?: ProcessUpdateOneWithoutProsNestedInput
    steps?: ProStepUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    processId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ProStepUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProCreateManyInput = {
    id?: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    processId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProUpdateManyMutationInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    processId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProStepCreateInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    pro: ProCreateNestedOneWithoutStepsInput
    machine?: MachineCreateNestedOneWithoutProStepsInput
    materials?: ProStepMaterialCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportCreateNestedManyWithoutStepInput
  }

  export type ProStepUncheckedCreateInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    materials?: ProStepMaterialUncheckedCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutStepInput
  }

  export type ProStepUpdateInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    pro?: ProUpdateOneRequiredWithoutStepsNestedInput
    machine?: MachineUpdateOneWithoutProStepsNestedInput
    materials?: ProStepMaterialUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProStepMaterialUncheckedUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutStepNestedInput
  }

  export type ProStepCreateManyInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
  }

  export type ProStepUpdateManyMutationInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProStepUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProStepMaterialCreateInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    step: ProStepCreateNestedOneWithoutMaterialsInput
    material: MaterialCreateNestedOneWithoutProStepMaterialsInput
  }

  export type ProStepMaterialUncheckedCreateInput = {
    id?: number
    stepId: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUpdateInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    step?: ProStepUpdateOneRequiredWithoutMaterialsNestedInput
    material?: MaterialUpdateOneRequiredWithoutProStepMaterialsNestedInput
  }

  export type ProStepMaterialUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialCreateManyInput = {
    id?: number
    stepId: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUpdateManyMutationInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportCreateInput = {
    id?: string
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    step: ProStepCreateNestedOneWithoutProductionReportsInput
  }

  export type ProductionReportUncheckedCreateInput = {
    id?: string
    proStepId: number
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductionReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    step?: ProStepUpdateOneRequiredWithoutProductionReportsNestedInput
  }

  export type ProductionReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    proStepId?: IntFieldUpdateOperationsInput | number
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductionReportCreateManyInput = {
    id?: string
    proStepId: number
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductionReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductionReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    proStepId?: IntFieldUpdateOperationsInput | number
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumUomFilter<$PrismaModel = never> = {
    equals?: $Enums.Uom | EnumUomFieldRefInput<$PrismaModel>
    in?: $Enums.Uom[]
    notIn?: $Enums.Uom[]
    not?: NestedEnumUomFilter<$PrismaModel> | $Enums.Uom
  }

  export type EnumMachineTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MachineType | EnumMachineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MachineType[]
    notIn?: $Enums.MachineType[]
    not?: NestedEnumMachineTypeFilter<$PrismaModel> | $Enums.MachineType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ProStepListRelationFilter = {
    every?: ProStepWhereInput
    some?: ProStepWhereInput
    none?: ProStepWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProStepOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MachineOrderByRelevanceInput = {
    fields: MachineOrderByRelevanceFieldEnum | MachineOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MachineCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrder
    partNumber?: SortOrder
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
    shortDesc?: SortOrder
    phase?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MachineAvgOrderByAggregateInput = {
    id?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
  }

  export type MachineMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrder
    partNumber?: SortOrder
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
    shortDesc?: SortOrder
    phase?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MachineMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrder
    partNumber?: SortOrder
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
    shortDesc?: SortOrder
    phase?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MachineSumOrderByAggregateInput = {
    id?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumUomWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Uom | EnumUomFieldRefInput<$PrismaModel>
    in?: $Enums.Uom[]
    notIn?: $Enums.Uom[]
    not?: NestedEnumUomWithAggregatesFilter<$PrismaModel> | $Enums.Uom
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUomFilter<$PrismaModel>
    _max?: NestedEnumUomFilter<$PrismaModel>
  }

  export type EnumMachineTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MachineType | EnumMachineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MachineType[]
    notIn?: $Enums.MachineType[]
    not?: NestedEnumMachineTypeWithAggregatesFilter<$PrismaModel> | $Enums.MachineType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMachineTypeFilter<$PrismaModel>
    _max?: NestedEnumMachineTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ProStepMaterialListRelationFilter = {
    every?: ProStepMaterialWhereInput
    some?: ProStepMaterialWhereInput
    none?: ProStepMaterialWhereInput
  }

  export type ProStepMaterialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MaterialOrderByRelevanceInput = {
    fields: MaterialOrderByRelevanceFieldEnum | MaterialOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MaterialCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaterialAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaterialMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaterialSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumProTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProType | EnumProTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProType[]
    notIn?: $Enums.ProType[]
    not?: NestedEnumProTypeFilter<$PrismaModel> | $Enums.ProType
  }

  export type ProListRelationFilter = {
    every?: ProWhereInput
    some?: ProWhereInput
    none?: ProWhereInput
  }

  export type ProOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProcessOrderByRelevanceInput = {
    fields: ProcessOrderByRelevanceFieldEnum | ProcessOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProcessCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProcessAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProcessMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProcessMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProcessSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumProTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProType | EnumProTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProType[]
    notIn?: $Enums.ProType[]
    not?: NestedEnumProTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProTypeFilter<$PrismaModel>
    _max?: NestedEnumProTypeFilter<$PrismaModel>
  }

  export type ProSequenceOrderByRelevanceInput = {
    fields: ProSequenceOrderByRelevanceFieldEnum | ProSequenceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProSequenceCountOrderByAggregateInput = {
    prefix?: SortOrder
    last?: SortOrder
  }

  export type ProSequenceAvgOrderByAggregateInput = {
    last?: SortOrder
  }

  export type ProSequenceMaxOrderByAggregateInput = {
    prefix?: SortOrder
    last?: SortOrder
  }

  export type ProSequenceMinOrderByAggregateInput = {
    prefix?: SortOrder
    last?: SortOrder
  }

  export type ProSequenceSumOrderByAggregateInput = {
    last?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumProStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProStatus | EnumProStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProStatus[]
    notIn?: $Enums.ProStatus[]
    not?: NestedEnumProStatusFilter<$PrismaModel> | $Enums.ProStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProcessNullableScalarRelationFilter = {
    is?: ProcessWhereInput | null
    isNot?: ProcessWhereInput | null
  }

  export type ProOrderByRelevanceInput = {
    fields: ProOrderByRelevanceFieldEnum | ProOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProCountOrderByAggregateInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    processId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProAvgOrderByAggregateInput = {
    id?: SortOrder
    qtyPoPcs?: SortOrder
    processId?: SortOrder
  }

  export type ProMaxOrderByAggregateInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    processId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProMinOrderByAggregateInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    processId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProSumOrderByAggregateInput = {
    id?: SortOrder
    qtyPoPcs?: SortOrder
    processId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumProStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProStatus | EnumProStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProStatus[]
    notIn?: $Enums.ProStatus[]
    not?: NestedEnumProStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProStatusFilter<$PrismaModel>
    _max?: NestedEnumProStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProScalarRelationFilter = {
    is?: ProWhereInput
    isNot?: ProWhereInput
  }

  export type MachineNullableScalarRelationFilter = {
    is?: MachineWhereInput | null
    isNot?: MachineWhereInput | null
  }

  export type ProductionReportListRelationFilter = {
    every?: ProductionReportWhereInput
    some?: ProductionReportWhereInput
    none?: ProductionReportWhereInput
  }

  export type ProductionReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProStepOrderByRelevanceInput = {
    fields: ProStepOrderByRelevanceFieldEnum | ProStepOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProStepProIdOrderNoCompoundUniqueInput = {
    proId: number
    orderNo: number
  }

  export type ProStepCountOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    manPowerStd?: SortOrder
    cycleTimeStd?: SortOrder
    cavityStd?: SortOrder
  }

  export type ProStepAvgOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    machineId?: SortOrder
    manPowerStd?: SortOrder
    cycleTimeStd?: SortOrder
    cavityStd?: SortOrder
  }

  export type ProStepMaxOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    manPowerStd?: SortOrder
    cycleTimeStd?: SortOrder
    cavityStd?: SortOrder
  }

  export type ProStepMinOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    manPowerStd?: SortOrder
    cycleTimeStd?: SortOrder
    cavityStd?: SortOrder
  }

  export type ProStepSumOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    machineId?: SortOrder
    manPowerStd?: SortOrder
    cycleTimeStd?: SortOrder
    cavityStd?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type ProStepScalarRelationFilter = {
    is?: ProStepWhereInput
    isNot?: ProStepWhereInput
  }

  export type MaterialScalarRelationFilter = {
    is?: MaterialWhereInput
    isNot?: MaterialWhereInput
  }

  export type ProStepMaterialStepIdMaterialIdCompoundUniqueInput = {
    stepId: number
    materialId: number
  }

  export type ProStepMaterialCountOrderByAggregateInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProStepMaterialAvgOrderByAggregateInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProStepMaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProStepMaterialMinOrderByAggregateInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProStepMaterialSumOrderByAggregateInput = {
    id?: SortOrder
    stepId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumLphTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LphType | EnumLphTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LphType[]
    notIn?: $Enums.LphType[]
    not?: NestedEnumLphTypeFilter<$PrismaModel> | $Enums.LphType
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProductionReportOrderByRelevanceInput = {
    fields: ProductionReportOrderByRelevanceFieldEnum | ProductionReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductionReportCountOrderByAggregateInput = {
    id?: SortOrder
    proStepId?: SortOrder
    reportDate?: SortOrder
    shift?: SortOrder
    operatorName?: SortOrder
    reportType?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    batchNo?: SortOrder
    manPowerStd?: SortOrder
    manPowerAct?: SortOrder
    cycleTimeStd?: SortOrder
    cycleTimeAct?: SortOrder
    cavityStd?: SortOrder
    cavityAct?: SortOrder
    inputMaterialQty?: SortOrder
    materialRunnerQty?: SortOrder
    materialPurgeQty?: SortOrder
    qtyPassOn?: SortOrder
    qtyHold?: SortOrder
    qtyWip?: SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrder
    downtimeBreakdown?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    metaData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductionReportAvgOrderByAggregateInput = {
    proStepId?: SortOrder
    shift?: SortOrder
    manPowerStd?: SortOrder
    manPowerAct?: SortOrder
    cycleTimeStd?: SortOrder
    cycleTimeAct?: SortOrder
    cavityStd?: SortOrder
    cavityAct?: SortOrder
    inputMaterialQty?: SortOrder
    materialRunnerQty?: SortOrder
    materialPurgeQty?: SortOrder
    qtyPassOn?: SortOrder
    qtyHold?: SortOrder
    qtyWip?: SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
  }

  export type ProductionReportMaxOrderByAggregateInput = {
    id?: SortOrder
    proStepId?: SortOrder
    reportDate?: SortOrder
    shift?: SortOrder
    operatorName?: SortOrder
    reportType?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    batchNo?: SortOrder
    manPowerStd?: SortOrder
    manPowerAct?: SortOrder
    cycleTimeStd?: SortOrder
    cycleTimeAct?: SortOrder
    cavityStd?: SortOrder
    cavityAct?: SortOrder
    inputMaterialQty?: SortOrder
    materialRunnerQty?: SortOrder
    materialPurgeQty?: SortOrder
    qtyPassOn?: SortOrder
    qtyHold?: SortOrder
    qtyWip?: SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductionReportMinOrderByAggregateInput = {
    id?: SortOrder
    proStepId?: SortOrder
    reportDate?: SortOrder
    shift?: SortOrder
    operatorName?: SortOrder
    reportType?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    batchNo?: SortOrder
    manPowerStd?: SortOrder
    manPowerAct?: SortOrder
    cycleTimeStd?: SortOrder
    cycleTimeAct?: SortOrder
    cavityStd?: SortOrder
    cavityAct?: SortOrder
    inputMaterialQty?: SortOrder
    materialRunnerQty?: SortOrder
    materialPurgeQty?: SortOrder
    qtyPassOn?: SortOrder
    qtyHold?: SortOrder
    qtyWip?: SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductionReportSumOrderByAggregateInput = {
    proStepId?: SortOrder
    shift?: SortOrder
    manPowerStd?: SortOrder
    manPowerAct?: SortOrder
    cycleTimeStd?: SortOrder
    cycleTimeAct?: SortOrder
    cavityStd?: SortOrder
    cavityAct?: SortOrder
    inputMaterialQty?: SortOrder
    materialRunnerQty?: SortOrder
    materialPurgeQty?: SortOrder
    qtyPassOn?: SortOrder
    qtyHold?: SortOrder
    qtyWip?: SortOrder
    qtyGood?: SortOrder
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
  }

  export type EnumLphTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LphType | EnumLphTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LphType[]
    notIn?: $Enums.LphType[]
    not?: NestedEnumLphTypeWithAggregatesFilter<$PrismaModel> | $Enums.LphType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLphTypeFilter<$PrismaModel>
    _max?: NestedEnumLphTypeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProStepCreateNestedManyWithoutMachineInput = {
    create?: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput> | ProStepCreateWithoutMachineInput[] | ProStepUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutMachineInput | ProStepCreateOrConnectWithoutMachineInput[]
    createMany?: ProStepCreateManyMachineInputEnvelope
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
  }

  export type ProStepUncheckedCreateNestedManyWithoutMachineInput = {
    create?: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput> | ProStepCreateWithoutMachineInput[] | ProStepUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutMachineInput | ProStepCreateOrConnectWithoutMachineInput[]
    createMany?: ProStepCreateManyMachineInputEnvelope
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumUomFieldUpdateOperationsInput = {
    set?: $Enums.Uom
  }

  export type EnumMachineTypeFieldUpdateOperationsInput = {
    set?: $Enums.MachineType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProStepUpdateManyWithoutMachineNestedInput = {
    create?: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput> | ProStepCreateWithoutMachineInput[] | ProStepUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutMachineInput | ProStepCreateOrConnectWithoutMachineInput[]
    upsert?: ProStepUpsertWithWhereUniqueWithoutMachineInput | ProStepUpsertWithWhereUniqueWithoutMachineInput[]
    createMany?: ProStepCreateManyMachineInputEnvelope
    set?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    disconnect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    delete?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    update?: ProStepUpdateWithWhereUniqueWithoutMachineInput | ProStepUpdateWithWhereUniqueWithoutMachineInput[]
    updateMany?: ProStepUpdateManyWithWhereWithoutMachineInput | ProStepUpdateManyWithWhereWithoutMachineInput[]
    deleteMany?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
  }

  export type ProStepUncheckedUpdateManyWithoutMachineNestedInput = {
    create?: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput> | ProStepCreateWithoutMachineInput[] | ProStepUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutMachineInput | ProStepCreateOrConnectWithoutMachineInput[]
    upsert?: ProStepUpsertWithWhereUniqueWithoutMachineInput | ProStepUpsertWithWhereUniqueWithoutMachineInput[]
    createMany?: ProStepCreateManyMachineInputEnvelope
    set?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    disconnect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    delete?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    update?: ProStepUpdateWithWhereUniqueWithoutMachineInput | ProStepUpdateWithWhereUniqueWithoutMachineInput[]
    updateMany?: ProStepUpdateManyWithWhereWithoutMachineInput | ProStepUpdateManyWithWhereWithoutMachineInput[]
    deleteMany?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
  }

  export type ProStepMaterialCreateNestedManyWithoutMaterialInput = {
    create?: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput> | ProStepMaterialCreateWithoutMaterialInput[] | ProStepMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutMaterialInput | ProStepMaterialCreateOrConnectWithoutMaterialInput[]
    createMany?: ProStepMaterialCreateManyMaterialInputEnvelope
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
  }

  export type ProStepMaterialUncheckedCreateNestedManyWithoutMaterialInput = {
    create?: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput> | ProStepMaterialCreateWithoutMaterialInput[] | ProStepMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutMaterialInput | ProStepMaterialCreateOrConnectWithoutMaterialInput[]
    createMany?: ProStepMaterialCreateManyMaterialInputEnvelope
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
  }

  export type ProStepMaterialUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput> | ProStepMaterialCreateWithoutMaterialInput[] | ProStepMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutMaterialInput | ProStepMaterialCreateOrConnectWithoutMaterialInput[]
    upsert?: ProStepMaterialUpsertWithWhereUniqueWithoutMaterialInput | ProStepMaterialUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: ProStepMaterialCreateManyMaterialInputEnvelope
    set?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    disconnect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    delete?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    update?: ProStepMaterialUpdateWithWhereUniqueWithoutMaterialInput | ProStepMaterialUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: ProStepMaterialUpdateManyWithWhereWithoutMaterialInput | ProStepMaterialUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
  }

  export type ProStepMaterialUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput> | ProStepMaterialCreateWithoutMaterialInput[] | ProStepMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutMaterialInput | ProStepMaterialCreateOrConnectWithoutMaterialInput[]
    upsert?: ProStepMaterialUpsertWithWhereUniqueWithoutMaterialInput | ProStepMaterialUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: ProStepMaterialCreateManyMaterialInputEnvelope
    set?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    disconnect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    delete?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    update?: ProStepMaterialUpdateWithWhereUniqueWithoutMaterialInput | ProStepMaterialUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: ProStepMaterialUpdateManyWithWhereWithoutMaterialInput | ProStepMaterialUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
  }

  export type ProCreateNestedManyWithoutProcessInput = {
    create?: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput> | ProCreateWithoutProcessInput[] | ProUncheckedCreateWithoutProcessInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProcessInput | ProCreateOrConnectWithoutProcessInput[]
    createMany?: ProCreateManyProcessInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type ProUncheckedCreateNestedManyWithoutProcessInput = {
    create?: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput> | ProCreateWithoutProcessInput[] | ProUncheckedCreateWithoutProcessInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProcessInput | ProCreateOrConnectWithoutProcessInput[]
    createMany?: ProCreateManyProcessInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type EnumProTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProType
  }

  export type ProUpdateManyWithoutProcessNestedInput = {
    create?: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput> | ProCreateWithoutProcessInput[] | ProUncheckedCreateWithoutProcessInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProcessInput | ProCreateOrConnectWithoutProcessInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutProcessInput | ProUpsertWithWhereUniqueWithoutProcessInput[]
    createMany?: ProCreateManyProcessInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutProcessInput | ProUpdateWithWhereUniqueWithoutProcessInput[]
    updateMany?: ProUpdateManyWithWhereWithoutProcessInput | ProUpdateManyWithWhereWithoutProcessInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProUncheckedUpdateManyWithoutProcessNestedInput = {
    create?: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput> | ProCreateWithoutProcessInput[] | ProUncheckedCreateWithoutProcessInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProcessInput | ProCreateOrConnectWithoutProcessInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutProcessInput | ProUpsertWithWhereUniqueWithoutProcessInput[]
    createMany?: ProCreateManyProcessInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutProcessInput | ProUpdateWithWhereUniqueWithoutProcessInput[]
    updateMany?: ProUpdateManyWithWhereWithoutProcessInput | ProUpdateManyWithWhereWithoutProcessInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProcessCreateNestedOneWithoutProsInput = {
    create?: XOR<ProcessCreateWithoutProsInput, ProcessUncheckedCreateWithoutProsInput>
    connectOrCreate?: ProcessCreateOrConnectWithoutProsInput
    connect?: ProcessWhereUniqueInput
  }

  export type ProStepCreateNestedManyWithoutProInput = {
    create?: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput> | ProStepCreateWithoutProInput[] | ProStepUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutProInput | ProStepCreateOrConnectWithoutProInput[]
    createMany?: ProStepCreateManyProInputEnvelope
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
  }

  export type ProStepUncheckedCreateNestedManyWithoutProInput = {
    create?: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput> | ProStepCreateWithoutProInput[] | ProStepUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutProInput | ProStepCreateOrConnectWithoutProInput[]
    createMany?: ProStepCreateManyProInputEnvelope
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumProStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProcessUpdateOneWithoutProsNestedInput = {
    create?: XOR<ProcessCreateWithoutProsInput, ProcessUncheckedCreateWithoutProsInput>
    connectOrCreate?: ProcessCreateOrConnectWithoutProsInput
    upsert?: ProcessUpsertWithoutProsInput
    disconnect?: ProcessWhereInput | boolean
    delete?: ProcessWhereInput | boolean
    connect?: ProcessWhereUniqueInput
    update?: XOR<XOR<ProcessUpdateToOneWithWhereWithoutProsInput, ProcessUpdateWithoutProsInput>, ProcessUncheckedUpdateWithoutProsInput>
  }

  export type ProStepUpdateManyWithoutProNestedInput = {
    create?: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput> | ProStepCreateWithoutProInput[] | ProStepUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutProInput | ProStepCreateOrConnectWithoutProInput[]
    upsert?: ProStepUpsertWithWhereUniqueWithoutProInput | ProStepUpsertWithWhereUniqueWithoutProInput[]
    createMany?: ProStepCreateManyProInputEnvelope
    set?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    disconnect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    delete?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    update?: ProStepUpdateWithWhereUniqueWithoutProInput | ProStepUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: ProStepUpdateManyWithWhereWithoutProInput | ProStepUpdateManyWithWhereWithoutProInput[]
    deleteMany?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
  }

  export type ProStepUncheckedUpdateManyWithoutProNestedInput = {
    create?: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput> | ProStepCreateWithoutProInput[] | ProStepUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProStepCreateOrConnectWithoutProInput | ProStepCreateOrConnectWithoutProInput[]
    upsert?: ProStepUpsertWithWhereUniqueWithoutProInput | ProStepUpsertWithWhereUniqueWithoutProInput[]
    createMany?: ProStepCreateManyProInputEnvelope
    set?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    disconnect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    delete?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    connect?: ProStepWhereUniqueInput | ProStepWhereUniqueInput[]
    update?: ProStepUpdateWithWhereUniqueWithoutProInput | ProStepUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: ProStepUpdateManyWithWhereWithoutProInput | ProStepUpdateManyWithWhereWithoutProInput[]
    deleteMany?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
  }

  export type ProCreateNestedOneWithoutStepsInput = {
    create?: XOR<ProCreateWithoutStepsInput, ProUncheckedCreateWithoutStepsInput>
    connectOrCreate?: ProCreateOrConnectWithoutStepsInput
    connect?: ProWhereUniqueInput
  }

  export type MachineCreateNestedOneWithoutProStepsInput = {
    create?: XOR<MachineCreateWithoutProStepsInput, MachineUncheckedCreateWithoutProStepsInput>
    connectOrCreate?: MachineCreateOrConnectWithoutProStepsInput
    connect?: MachineWhereUniqueInput
  }

  export type ProStepMaterialCreateNestedManyWithoutStepInput = {
    create?: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput> | ProStepMaterialCreateWithoutStepInput[] | ProStepMaterialUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutStepInput | ProStepMaterialCreateOrConnectWithoutStepInput[]
    createMany?: ProStepMaterialCreateManyStepInputEnvelope
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
  }

  export type ProductionReportCreateNestedManyWithoutStepInput = {
    create?: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput> | ProductionReportCreateWithoutStepInput[] | ProductionReportUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutStepInput | ProductionReportCreateOrConnectWithoutStepInput[]
    createMany?: ProductionReportCreateManyStepInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ProStepMaterialUncheckedCreateNestedManyWithoutStepInput = {
    create?: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput> | ProStepMaterialCreateWithoutStepInput[] | ProStepMaterialUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutStepInput | ProStepMaterialCreateOrConnectWithoutStepInput[]
    createMany?: ProStepMaterialCreateManyStepInputEnvelope
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
  }

  export type ProductionReportUncheckedCreateNestedManyWithoutStepInput = {
    create?: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput> | ProductionReportCreateWithoutStepInput[] | ProductionReportUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutStepInput | ProductionReportCreateOrConnectWithoutStepInput[]
    createMany?: ProductionReportCreateManyStepInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ProUpdateOneRequiredWithoutStepsNestedInput = {
    create?: XOR<ProCreateWithoutStepsInput, ProUncheckedCreateWithoutStepsInput>
    connectOrCreate?: ProCreateOrConnectWithoutStepsInput
    upsert?: ProUpsertWithoutStepsInput
    connect?: ProWhereUniqueInput
    update?: XOR<XOR<ProUpdateToOneWithWhereWithoutStepsInput, ProUpdateWithoutStepsInput>, ProUncheckedUpdateWithoutStepsInput>
  }

  export type MachineUpdateOneWithoutProStepsNestedInput = {
    create?: XOR<MachineCreateWithoutProStepsInput, MachineUncheckedCreateWithoutProStepsInput>
    connectOrCreate?: MachineCreateOrConnectWithoutProStepsInput
    upsert?: MachineUpsertWithoutProStepsInput
    disconnect?: MachineWhereInput | boolean
    delete?: MachineWhereInput | boolean
    connect?: MachineWhereUniqueInput
    update?: XOR<XOR<MachineUpdateToOneWithWhereWithoutProStepsInput, MachineUpdateWithoutProStepsInput>, MachineUncheckedUpdateWithoutProStepsInput>
  }

  export type ProStepMaterialUpdateManyWithoutStepNestedInput = {
    create?: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput> | ProStepMaterialCreateWithoutStepInput[] | ProStepMaterialUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutStepInput | ProStepMaterialCreateOrConnectWithoutStepInput[]
    upsert?: ProStepMaterialUpsertWithWhereUniqueWithoutStepInput | ProStepMaterialUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: ProStepMaterialCreateManyStepInputEnvelope
    set?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    disconnect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    delete?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    update?: ProStepMaterialUpdateWithWhereUniqueWithoutStepInput | ProStepMaterialUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: ProStepMaterialUpdateManyWithWhereWithoutStepInput | ProStepMaterialUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
  }

  export type ProductionReportUpdateManyWithoutStepNestedInput = {
    create?: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput> | ProductionReportCreateWithoutStepInput[] | ProductionReportUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutStepInput | ProductionReportCreateOrConnectWithoutStepInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutStepInput | ProductionReportUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: ProductionReportCreateManyStepInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutStepInput | ProductionReportUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutStepInput | ProductionReportUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ProStepMaterialUncheckedUpdateManyWithoutStepNestedInput = {
    create?: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput> | ProStepMaterialCreateWithoutStepInput[] | ProStepMaterialUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProStepMaterialCreateOrConnectWithoutStepInput | ProStepMaterialCreateOrConnectWithoutStepInput[]
    upsert?: ProStepMaterialUpsertWithWhereUniqueWithoutStepInput | ProStepMaterialUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: ProStepMaterialCreateManyStepInputEnvelope
    set?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    disconnect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    delete?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    connect?: ProStepMaterialWhereUniqueInput | ProStepMaterialWhereUniqueInput[]
    update?: ProStepMaterialUpdateWithWhereUniqueWithoutStepInput | ProStepMaterialUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: ProStepMaterialUpdateManyWithWhereWithoutStepInput | ProStepMaterialUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
  }

  export type ProductionReportUncheckedUpdateManyWithoutStepNestedInput = {
    create?: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput> | ProductionReportCreateWithoutStepInput[] | ProductionReportUncheckedCreateWithoutStepInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutStepInput | ProductionReportCreateOrConnectWithoutStepInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutStepInput | ProductionReportUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: ProductionReportCreateManyStepInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutStepInput | ProductionReportUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutStepInput | ProductionReportUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ProStepCreateNestedOneWithoutMaterialsInput = {
    create?: XOR<ProStepCreateWithoutMaterialsInput, ProStepUncheckedCreateWithoutMaterialsInput>
    connectOrCreate?: ProStepCreateOrConnectWithoutMaterialsInput
    connect?: ProStepWhereUniqueInput
  }

  export type MaterialCreateNestedOneWithoutProStepMaterialsInput = {
    create?: XOR<MaterialCreateWithoutProStepMaterialsInput, MaterialUncheckedCreateWithoutProStepMaterialsInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutProStepMaterialsInput
    connect?: MaterialWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ProStepUpdateOneRequiredWithoutMaterialsNestedInput = {
    create?: XOR<ProStepCreateWithoutMaterialsInput, ProStepUncheckedCreateWithoutMaterialsInput>
    connectOrCreate?: ProStepCreateOrConnectWithoutMaterialsInput
    upsert?: ProStepUpsertWithoutMaterialsInput
    connect?: ProStepWhereUniqueInput
    update?: XOR<XOR<ProStepUpdateToOneWithWhereWithoutMaterialsInput, ProStepUpdateWithoutMaterialsInput>, ProStepUncheckedUpdateWithoutMaterialsInput>
  }

  export type MaterialUpdateOneRequiredWithoutProStepMaterialsNestedInput = {
    create?: XOR<MaterialCreateWithoutProStepMaterialsInput, MaterialUncheckedCreateWithoutProStepMaterialsInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutProStepMaterialsInput
    upsert?: MaterialUpsertWithoutProStepMaterialsInput
    connect?: MaterialWhereUniqueInput
    update?: XOR<XOR<MaterialUpdateToOneWithWhereWithoutProStepMaterialsInput, MaterialUpdateWithoutProStepMaterialsInput>, MaterialUncheckedUpdateWithoutProStepMaterialsInput>
  }

  export type ProStepCreateNestedOneWithoutProductionReportsInput = {
    create?: XOR<ProStepCreateWithoutProductionReportsInput, ProStepUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: ProStepCreateOrConnectWithoutProductionReportsInput
    connect?: ProStepWhereUniqueInput
  }

  export type EnumLphTypeFieldUpdateOperationsInput = {
    set?: $Enums.LphType
  }

  export type ProStepUpdateOneRequiredWithoutProductionReportsNestedInput = {
    create?: XOR<ProStepCreateWithoutProductionReportsInput, ProStepUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: ProStepCreateOrConnectWithoutProductionReportsInput
    upsert?: ProStepUpsertWithoutProductionReportsInput
    connect?: ProStepWhereUniqueInput
    update?: XOR<XOR<ProStepUpdateToOneWithWhereWithoutProductionReportsInput, ProStepUpdateWithoutProductionReportsInput>, ProStepUncheckedUpdateWithoutProductionReportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUomFilter<$PrismaModel = never> = {
    equals?: $Enums.Uom | EnumUomFieldRefInput<$PrismaModel>
    in?: $Enums.Uom[]
    notIn?: $Enums.Uom[]
    not?: NestedEnumUomFilter<$PrismaModel> | $Enums.Uom
  }

  export type NestedEnumMachineTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MachineType | EnumMachineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MachineType[]
    notIn?: $Enums.MachineType[]
    not?: NestedEnumMachineTypeFilter<$PrismaModel> | $Enums.MachineType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumUomWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Uom | EnumUomFieldRefInput<$PrismaModel>
    in?: $Enums.Uom[]
    notIn?: $Enums.Uom[]
    not?: NestedEnumUomWithAggregatesFilter<$PrismaModel> | $Enums.Uom
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUomFilter<$PrismaModel>
    _max?: NestedEnumUomFilter<$PrismaModel>
  }

  export type NestedEnumMachineTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MachineType | EnumMachineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MachineType[]
    notIn?: $Enums.MachineType[]
    not?: NestedEnumMachineTypeWithAggregatesFilter<$PrismaModel> | $Enums.MachineType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMachineTypeFilter<$PrismaModel>
    _max?: NestedEnumMachineTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProType | EnumProTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProType[]
    notIn?: $Enums.ProType[]
    not?: NestedEnumProTypeFilter<$PrismaModel> | $Enums.ProType
  }

  export type NestedEnumProTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProType | EnumProTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProType[]
    notIn?: $Enums.ProType[]
    not?: NestedEnumProTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProTypeFilter<$PrismaModel>
    _max?: NestedEnumProTypeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumProStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProStatus | EnumProStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProStatus[]
    notIn?: $Enums.ProStatus[]
    not?: NestedEnumProStatusFilter<$PrismaModel> | $Enums.ProStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumProStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProStatus | EnumProStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProStatus[]
    notIn?: $Enums.ProStatus[]
    not?: NestedEnumProStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProStatusFilter<$PrismaModel>
    _max?: NestedEnumProStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumLphTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LphType | EnumLphTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LphType[]
    notIn?: $Enums.LphType[]
    not?: NestedEnumLphTypeFilter<$PrismaModel> | $Enums.LphType
  }

  export type NestedEnumLphTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LphType | EnumLphTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LphType[]
    notIn?: $Enums.LphType[]
    not?: NestedEnumLphTypeWithAggregatesFilter<$PrismaModel> | $Enums.LphType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLphTypeFilter<$PrismaModel>
    _max?: NestedEnumLphTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProStepCreateWithoutMachineInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    pro: ProCreateNestedOneWithoutStepsInput
    materials?: ProStepMaterialCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportCreateNestedManyWithoutStepInput
  }

  export type ProStepUncheckedCreateWithoutMachineInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    materials?: ProStepMaterialUncheckedCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutStepInput
  }

  export type ProStepCreateOrConnectWithoutMachineInput = {
    where: ProStepWhereUniqueInput
    create: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput>
  }

  export type ProStepCreateManyMachineInputEnvelope = {
    data: ProStepCreateManyMachineInput | ProStepCreateManyMachineInput[]
    skipDuplicates?: boolean
  }

  export type ProStepUpsertWithWhereUniqueWithoutMachineInput = {
    where: ProStepWhereUniqueInput
    update: XOR<ProStepUpdateWithoutMachineInput, ProStepUncheckedUpdateWithoutMachineInput>
    create: XOR<ProStepCreateWithoutMachineInput, ProStepUncheckedCreateWithoutMachineInput>
  }

  export type ProStepUpdateWithWhereUniqueWithoutMachineInput = {
    where: ProStepWhereUniqueInput
    data: XOR<ProStepUpdateWithoutMachineInput, ProStepUncheckedUpdateWithoutMachineInput>
  }

  export type ProStepUpdateManyWithWhereWithoutMachineInput = {
    where: ProStepScalarWhereInput
    data: XOR<ProStepUpdateManyMutationInput, ProStepUncheckedUpdateManyWithoutMachineInput>
  }

  export type ProStepScalarWhereInput = {
    AND?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
    OR?: ProStepScalarWhereInput[]
    NOT?: ProStepScalarWhereInput | ProStepScalarWhereInput[]
    id?: IntFilter<"ProStep"> | number
    proId?: IntFilter<"ProStep"> | number
    orderNo?: IntFilter<"ProStep"> | number
    up?: IntNullableFilter<"ProStep"> | number | null
    estimatedShifts?: IntNullableFilter<"ProStep"> | number | null
    startDate?: DateTimeNullableFilter<"ProStep"> | Date | string | null
    machineId?: IntNullableFilter<"ProStep"> | number | null
    partNumber?: StringNullableFilter<"ProStep"> | string | null
    manPowerStd?: IntNullableFilter<"ProStep"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProStep"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProStep"> | number | null
  }

  export type ProStepMaterialCreateWithoutMaterialInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    step: ProStepCreateNestedOneWithoutMaterialsInput
  }

  export type ProStepMaterialUncheckedCreateWithoutMaterialInput = {
    id?: number
    stepId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialCreateOrConnectWithoutMaterialInput = {
    where: ProStepMaterialWhereUniqueInput
    create: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput>
  }

  export type ProStepMaterialCreateManyMaterialInputEnvelope = {
    data: ProStepMaterialCreateManyMaterialInput | ProStepMaterialCreateManyMaterialInput[]
    skipDuplicates?: boolean
  }

  export type ProStepMaterialUpsertWithWhereUniqueWithoutMaterialInput = {
    where: ProStepMaterialWhereUniqueInput
    update: XOR<ProStepMaterialUpdateWithoutMaterialInput, ProStepMaterialUncheckedUpdateWithoutMaterialInput>
    create: XOR<ProStepMaterialCreateWithoutMaterialInput, ProStepMaterialUncheckedCreateWithoutMaterialInput>
  }

  export type ProStepMaterialUpdateWithWhereUniqueWithoutMaterialInput = {
    where: ProStepMaterialWhereUniqueInput
    data: XOR<ProStepMaterialUpdateWithoutMaterialInput, ProStepMaterialUncheckedUpdateWithoutMaterialInput>
  }

  export type ProStepMaterialUpdateManyWithWhereWithoutMaterialInput = {
    where: ProStepMaterialScalarWhereInput
    data: XOR<ProStepMaterialUpdateManyMutationInput, ProStepMaterialUncheckedUpdateManyWithoutMaterialInput>
  }

  export type ProStepMaterialScalarWhereInput = {
    AND?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
    OR?: ProStepMaterialScalarWhereInput[]
    NOT?: ProStepMaterialScalarWhereInput | ProStepMaterialScalarWhereInput[]
    id?: IntFilter<"ProStepMaterial"> | number
    stepId?: IntFilter<"ProStepMaterial"> | number
    materialId?: IntFilter<"ProStepMaterial"> | number
    qtyReq?: DecimalFilter<"ProStepMaterial"> | Decimal | DecimalJsLike | number | string
  }

  export type ProCreateWithoutProcessInput = {
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ProStepCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateWithoutProcessInput = {
    id?: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    steps?: ProStepUncheckedCreateNestedManyWithoutProInput
  }

  export type ProCreateOrConnectWithoutProcessInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput>
  }

  export type ProCreateManyProcessInputEnvelope = {
    data: ProCreateManyProcessInput | ProCreateManyProcessInput[]
    skipDuplicates?: boolean
  }

  export type ProUpsertWithWhereUniqueWithoutProcessInput = {
    where: ProWhereUniqueInput
    update: XOR<ProUpdateWithoutProcessInput, ProUncheckedUpdateWithoutProcessInput>
    create: XOR<ProCreateWithoutProcessInput, ProUncheckedCreateWithoutProcessInput>
  }

  export type ProUpdateWithWhereUniqueWithoutProcessInput = {
    where: ProWhereUniqueInput
    data: XOR<ProUpdateWithoutProcessInput, ProUncheckedUpdateWithoutProcessInput>
  }

  export type ProUpdateManyWithWhereWithoutProcessInput = {
    where: ProScalarWhereInput
    data: XOR<ProUpdateManyMutationInput, ProUncheckedUpdateManyWithoutProcessInput>
  }

  export type ProScalarWhereInput = {
    AND?: ProScalarWhereInput | ProScalarWhereInput[]
    OR?: ProScalarWhereInput[]
    NOT?: ProScalarWhereInput | ProScalarWhereInput[]
    id?: IntFilter<"Pro"> | number
    proNumber?: StringFilter<"Pro"> | string
    productName?: StringFilter<"Pro"> | string
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    processId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
  }

  export type ProcessCreateWithoutProsInput = {
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProcessUncheckedCreateWithoutProsInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProcessCreateOrConnectWithoutProsInput = {
    where: ProcessWhereUniqueInput
    create: XOR<ProcessCreateWithoutProsInput, ProcessUncheckedCreateWithoutProsInput>
  }

  export type ProStepCreateWithoutProInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    machine?: MachineCreateNestedOneWithoutProStepsInput
    materials?: ProStepMaterialCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportCreateNestedManyWithoutStepInput
  }

  export type ProStepUncheckedCreateWithoutProInput = {
    id?: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    materials?: ProStepMaterialUncheckedCreateNestedManyWithoutStepInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutStepInput
  }

  export type ProStepCreateOrConnectWithoutProInput = {
    where: ProStepWhereUniqueInput
    create: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput>
  }

  export type ProStepCreateManyProInputEnvelope = {
    data: ProStepCreateManyProInput | ProStepCreateManyProInput[]
    skipDuplicates?: boolean
  }

  export type ProcessUpsertWithoutProsInput = {
    update: XOR<ProcessUpdateWithoutProsInput, ProcessUncheckedUpdateWithoutProsInput>
    create: XOR<ProcessCreateWithoutProsInput, ProcessUncheckedCreateWithoutProsInput>
    where?: ProcessWhereInput
  }

  export type ProcessUpdateToOneWithWhereWithoutProsInput = {
    where?: ProcessWhereInput
    data: XOR<ProcessUpdateWithoutProsInput, ProcessUncheckedUpdateWithoutProsInput>
  }

  export type ProcessUpdateWithoutProsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProcessUncheckedUpdateWithoutProsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProStepUpsertWithWhereUniqueWithoutProInput = {
    where: ProStepWhereUniqueInput
    update: XOR<ProStepUpdateWithoutProInput, ProStepUncheckedUpdateWithoutProInput>
    create: XOR<ProStepCreateWithoutProInput, ProStepUncheckedCreateWithoutProInput>
  }

  export type ProStepUpdateWithWhereUniqueWithoutProInput = {
    where: ProStepWhereUniqueInput
    data: XOR<ProStepUpdateWithoutProInput, ProStepUncheckedUpdateWithoutProInput>
  }

  export type ProStepUpdateManyWithWhereWithoutProInput = {
    where: ProStepScalarWhereInput
    data: XOR<ProStepUpdateManyMutationInput, ProStepUncheckedUpdateManyWithoutProInput>
  }

  export type ProCreateWithoutStepsInput = {
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    process?: ProcessCreateNestedOneWithoutProsInput
  }

  export type ProUncheckedCreateWithoutStepsInput = {
    id?: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    processId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProCreateOrConnectWithoutStepsInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutStepsInput, ProUncheckedCreateWithoutStepsInput>
  }

  export type MachineCreateWithoutProStepsInput = {
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    partNumber?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    shortDesc?: string | null
    phase?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MachineUncheckedCreateWithoutProStepsInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    partNumber?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    shortDesc?: string | null
    phase?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MachineCreateOrConnectWithoutProStepsInput = {
    where: MachineWhereUniqueInput
    create: XOR<MachineCreateWithoutProStepsInput, MachineUncheckedCreateWithoutProStepsInput>
  }

  export type ProStepMaterialCreateWithoutStepInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    material: MaterialCreateNestedOneWithoutProStepMaterialsInput
  }

  export type ProStepMaterialUncheckedCreateWithoutStepInput = {
    id?: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialCreateOrConnectWithoutStepInput = {
    where: ProStepMaterialWhereUniqueInput
    create: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput>
  }

  export type ProStepMaterialCreateManyStepInputEnvelope = {
    data: ProStepMaterialCreateManyStepInput | ProStepMaterialCreateManyStepInput[]
    skipDuplicates?: boolean
  }

  export type ProductionReportCreateWithoutStepInput = {
    id?: string
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductionReportUncheckedCreateWithoutStepInput = {
    id?: string
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductionReportCreateOrConnectWithoutStepInput = {
    where: ProductionReportWhereUniqueInput
    create: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput>
  }

  export type ProductionReportCreateManyStepInputEnvelope = {
    data: ProductionReportCreateManyStepInput | ProductionReportCreateManyStepInput[]
    skipDuplicates?: boolean
  }

  export type ProUpsertWithoutStepsInput = {
    update: XOR<ProUpdateWithoutStepsInput, ProUncheckedUpdateWithoutStepsInput>
    create: XOR<ProCreateWithoutStepsInput, ProUncheckedCreateWithoutStepsInput>
    where?: ProWhereInput
  }

  export type ProUpdateToOneWithWhereWithoutStepsInput = {
    where?: ProWhereInput
    data: XOR<ProUpdateWithoutStepsInput, ProUncheckedUpdateWithoutStepsInput>
  }

  export type ProUpdateWithoutStepsInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    process?: ProcessUpdateOneWithoutProsNestedInput
  }

  export type ProUncheckedUpdateWithoutStepsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    processId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MachineUpsertWithoutProStepsInput = {
    update: XOR<MachineUpdateWithoutProStepsInput, MachineUncheckedUpdateWithoutProStepsInput>
    create: XOR<MachineCreateWithoutProStepsInput, MachineUncheckedCreateWithoutProStepsInput>
    where?: MachineWhereInput
  }

  export type MachineUpdateToOneWithWhereWithoutProStepsInput = {
    where?: MachineWhereInput
    data: XOR<MachineUpdateWithoutProStepsInput, MachineUncheckedUpdateWithoutProStepsInput>
  }

  export type MachineUpdateWithoutProStepsInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MachineUncheckedUpdateWithoutProStepsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    shortDesc?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProStepMaterialUpsertWithWhereUniqueWithoutStepInput = {
    where: ProStepMaterialWhereUniqueInput
    update: XOR<ProStepMaterialUpdateWithoutStepInput, ProStepMaterialUncheckedUpdateWithoutStepInput>
    create: XOR<ProStepMaterialCreateWithoutStepInput, ProStepMaterialUncheckedCreateWithoutStepInput>
  }

  export type ProStepMaterialUpdateWithWhereUniqueWithoutStepInput = {
    where: ProStepMaterialWhereUniqueInput
    data: XOR<ProStepMaterialUpdateWithoutStepInput, ProStepMaterialUncheckedUpdateWithoutStepInput>
  }

  export type ProStepMaterialUpdateManyWithWhereWithoutStepInput = {
    where: ProStepMaterialScalarWhereInput
    data: XOR<ProStepMaterialUpdateManyMutationInput, ProStepMaterialUncheckedUpdateManyWithoutStepInput>
  }

  export type ProductionReportUpsertWithWhereUniqueWithoutStepInput = {
    where: ProductionReportWhereUniqueInput
    update: XOR<ProductionReportUpdateWithoutStepInput, ProductionReportUncheckedUpdateWithoutStepInput>
    create: XOR<ProductionReportCreateWithoutStepInput, ProductionReportUncheckedCreateWithoutStepInput>
  }

  export type ProductionReportUpdateWithWhereUniqueWithoutStepInput = {
    where: ProductionReportWhereUniqueInput
    data: XOR<ProductionReportUpdateWithoutStepInput, ProductionReportUncheckedUpdateWithoutStepInput>
  }

  export type ProductionReportUpdateManyWithWhereWithoutStepInput = {
    where: ProductionReportScalarWhereInput
    data: XOR<ProductionReportUpdateManyMutationInput, ProductionReportUncheckedUpdateManyWithoutStepInput>
  }

  export type ProductionReportScalarWhereInput = {
    AND?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
    OR?: ProductionReportScalarWhereInput[]
    NOT?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
    id?: StringFilter<"ProductionReport"> | string
    proStepId?: IntFilter<"ProductionReport"> | number
    reportDate?: DateTimeFilter<"ProductionReport"> | Date | string
    shift?: IntFilter<"ProductionReport"> | number
    operatorName?: StringFilter<"ProductionReport"> | string
    reportType?: EnumLphTypeFilter<"ProductionReport"> | $Enums.LphType
    startTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    endTime?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    batchNo?: StringNullableFilter<"ProductionReport"> | string | null
    manPowerStd?: IntNullableFilter<"ProductionReport"> | number | null
    manPowerAct?: IntNullableFilter<"ProductionReport"> | number | null
    cycleTimeStd?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    cavityStd?: IntNullableFilter<"ProductionReport"> | number | null
    cavityAct?: IntNullableFilter<"ProductionReport"> | number | null
    inputMaterialQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyHold?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyWip?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
  }

  export type ProStepCreateWithoutMaterialsInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    pro: ProCreateNestedOneWithoutStepsInput
    machine?: MachineCreateNestedOneWithoutProStepsInput
    productionReports?: ProductionReportCreateNestedManyWithoutStepInput
  }

  export type ProStepUncheckedCreateWithoutMaterialsInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutStepInput
  }

  export type ProStepCreateOrConnectWithoutMaterialsInput = {
    where: ProStepWhereUniqueInput
    create: XOR<ProStepCreateWithoutMaterialsInput, ProStepUncheckedCreateWithoutMaterialsInput>
  }

  export type MaterialCreateWithoutProStepMaterialsInput = {
    name: string
    uom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaterialUncheckedCreateWithoutProStepMaterialsInput = {
    id?: number
    name: string
    uom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaterialCreateOrConnectWithoutProStepMaterialsInput = {
    where: MaterialWhereUniqueInput
    create: XOR<MaterialCreateWithoutProStepMaterialsInput, MaterialUncheckedCreateWithoutProStepMaterialsInput>
  }

  export type ProStepUpsertWithoutMaterialsInput = {
    update: XOR<ProStepUpdateWithoutMaterialsInput, ProStepUncheckedUpdateWithoutMaterialsInput>
    create: XOR<ProStepCreateWithoutMaterialsInput, ProStepUncheckedCreateWithoutMaterialsInput>
    where?: ProStepWhereInput
  }

  export type ProStepUpdateToOneWithWhereWithoutMaterialsInput = {
    where?: ProStepWhereInput
    data: XOR<ProStepUpdateWithoutMaterialsInput, ProStepUncheckedUpdateWithoutMaterialsInput>
  }

  export type ProStepUpdateWithoutMaterialsInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    pro?: ProUpdateOneRequiredWithoutStepsNestedInput
    machine?: MachineUpdateOneWithoutProStepsNestedInput
    productionReports?: ProductionReportUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateWithoutMaterialsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    productionReports?: ProductionReportUncheckedUpdateManyWithoutStepNestedInput
  }

  export type MaterialUpsertWithoutProStepMaterialsInput = {
    update: XOR<MaterialUpdateWithoutProStepMaterialsInput, MaterialUncheckedUpdateWithoutProStepMaterialsInput>
    create: XOR<MaterialCreateWithoutProStepMaterialsInput, MaterialUncheckedCreateWithoutProStepMaterialsInput>
    where?: MaterialWhereInput
  }

  export type MaterialUpdateToOneWithWhereWithoutProStepMaterialsInput = {
    where?: MaterialWhereInput
    data: XOR<MaterialUpdateWithoutProStepMaterialsInput, MaterialUncheckedUpdateWithoutProStepMaterialsInput>
  }

  export type MaterialUpdateWithoutProStepMaterialsInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaterialUncheckedUpdateWithoutProStepMaterialsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProStepCreateWithoutProductionReportsInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    pro: ProCreateNestedOneWithoutStepsInput
    machine?: MachineCreateNestedOneWithoutProStepsInput
    materials?: ProStepMaterialCreateNestedManyWithoutStepInput
  }

  export type ProStepUncheckedCreateWithoutProductionReportsInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    materials?: ProStepMaterialUncheckedCreateNestedManyWithoutStepInput
  }

  export type ProStepCreateOrConnectWithoutProductionReportsInput = {
    where: ProStepWhereUniqueInput
    create: XOR<ProStepCreateWithoutProductionReportsInput, ProStepUncheckedCreateWithoutProductionReportsInput>
  }

  export type ProStepUpsertWithoutProductionReportsInput = {
    update: XOR<ProStepUpdateWithoutProductionReportsInput, ProStepUncheckedUpdateWithoutProductionReportsInput>
    create: XOR<ProStepCreateWithoutProductionReportsInput, ProStepUncheckedCreateWithoutProductionReportsInput>
    where?: ProStepWhereInput
  }

  export type ProStepUpdateToOneWithWhereWithoutProductionReportsInput = {
    where?: ProStepWhereInput
    data: XOR<ProStepUpdateWithoutProductionReportsInput, ProStepUncheckedUpdateWithoutProductionReportsInput>
  }

  export type ProStepUpdateWithoutProductionReportsInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    pro?: ProUpdateOneRequiredWithoutStepsNestedInput
    machine?: MachineUpdateOneWithoutProStepsNestedInput
    materials?: ProStepMaterialUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateWithoutProductionReportsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProStepMaterialUncheckedUpdateManyWithoutStepNestedInput
  }

  export type ProStepCreateManyMachineInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
  }

  export type ProStepUpdateWithoutMachineInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    pro?: ProUpdateOneRequiredWithoutStepsNestedInput
    materials?: ProStepMaterialUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateWithoutMachineInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProStepMaterialUncheckedUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateManyWithoutMachineInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProStepMaterialCreateManyMaterialInput = {
    id?: number
    stepId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUpdateWithoutMaterialInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    step?: ProStepUpdateOneRequiredWithoutMaterialsNestedInput
  }

  export type ProStepMaterialUncheckedUpdateWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUncheckedUpdateManyWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProCreateManyProcessInput = {
    id?: number
    proNumber: string
    productName: string
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProUpdateWithoutProcessInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ProStepUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateWithoutProcessInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    steps?: ProStepUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateManyWithoutProcessInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProStepCreateManyProInput = {
    id?: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    manPowerStd?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
  }

  export type ProStepUpdateWithoutProInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    machine?: MachineUpdateOneWithoutProStepsNestedInput
    materials?: ProStepMaterialUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateWithoutProInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProStepMaterialUncheckedUpdateManyWithoutStepNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutStepNestedInput
  }

  export type ProStepUncheckedUpdateManyWithoutProInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProStepMaterialCreateManyStepInput = {
    id?: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportCreateManyStepInput = {
    id?: string
    reportDate: Date | string
    shift: number
    operatorName: string
    reportType: $Enums.LphType
    startTime?: Date | string | null
    endTime?: Date | string | null
    batchNo?: string | null
    manPowerStd?: number | null
    manPowerAct?: number | null
    cycleTimeStd?: Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: Decimal | DecimalJsLike | number | string | null
    cavityStd?: number | null
    cavityAct?: number | null
    inputMaterialQty?: Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: Decimal | DecimalJsLike | number | string | null
    qtyHold?: Decimal | DecimalJsLike | number | string | null
    qtyWip?: Decimal | DecimalJsLike | number | string | null
    qtyGood?: Decimal | DecimalJsLike | number | string
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProStepMaterialUpdateWithoutStepInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    material?: MaterialUpdateOneRequiredWithoutProStepMaterialsNestedInput
  }

  export type ProStepMaterialUncheckedUpdateWithoutStepInput = {
    id?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProStepMaterialUncheckedUpdateManyWithoutStepInput = {
    id?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportUpdateWithoutStepInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductionReportUncheckedUpdateWithoutStepInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductionReportUncheckedUpdateManyWithoutStepInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: IntFieldUpdateOperationsInput | number
    operatorName?: StringFieldUpdateOperationsInput | string
    reportType?: EnumLphTypeFieldUpdateOperationsInput | $Enums.LphType
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    manPowerStd?: NullableIntFieldUpdateOperationsInput | number | null
    manPowerAct?: NullableIntFieldUpdateOperationsInput | number | null
    cycleTimeStd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeAct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavityStd?: NullableIntFieldUpdateOperationsInput | number | null
    cavityAct?: NullableIntFieldUpdateOperationsInput | number | null
    inputMaterialQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialRunnerQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    materialPurgeQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyPassOn?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyHold?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyWip?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    qtyGood?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}