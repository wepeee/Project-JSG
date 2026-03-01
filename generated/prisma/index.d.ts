
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
 * Model Item
 * 
 */
export type Item = $Result.DefaultSelection<Prisma.$ItemPayload>
/**
 * Model ProPrefix
 * 
 */
export type ProPrefix = $Result.DefaultSelection<Prisma.$ProPrefixPayload>
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
 * Model Proses
 * 
 */
export type Proses = $Result.DefaultSelection<Prisma.$ProsesPayload>
/**
 * Model ProsesMaterial
 * 
 */
export type ProsesMaterial = $Result.DefaultSelection<Prisma.$ProsesMaterialPayload>
/**
 * Model ProductionReport
 * 
 */
export type ProductionReport = $Result.DefaultSelection<Prisma.$ProductionReportPayload>
/**
 * Model InventoryLocation
 * 
 */
export type InventoryLocation = $Result.DefaultSelection<Prisma.$InventoryLocationPayload>
/**
 * Model InventoryTxn
 * 
 */
export type InventoryTxn = $Result.DefaultSelection<Prisma.$InventoryTxnPayload>

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


export const MaterialType: {
  RAW: 'RAW',
  WIP: 'WIP',
  CONSUMABLE: 'CONSUMABLE'
};

export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType]


export const ItemKind: {
  RAW: 'RAW',
  WIP: 'WIP',
  FG: 'FG',
  CONSUMABLE: 'CONSUMABLE'
};

export type ItemKind = (typeof ItemKind)[keyof typeof ItemKind]


export const ItemStatus: {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus]


export const ProStatus: {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED'
};

export type ProStatus = (typeof ProStatus)[keyof typeof ProStatus]


export const ProType: {
  PAPER: 'PAPER',
  RIGID: 'RIGID',
  OTHER: 'OTHER'
};

export type ProType = (typeof ProType)[keyof typeof ProType]


export const ReportStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  VOID: 'VOID'
};

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus]


export const LphType: {
  PAPER: 'PAPER',
  PRINTING: 'PRINTING',
  PACKING_ASSEMBLY: 'PACKING_ASSEMBLY',
  BLOW_MOULDING: 'BLOW_MOULDING',
  INJECTION: 'INJECTION'
};

export type LphType = (typeof LphType)[keyof typeof LphType]


export const LocationType: {
  WIP: 'WIP',
  FG: 'FG',
  RAW: 'RAW',
  HOLD: 'HOLD',
  SCRAP: 'SCRAP'
};

export type LocationType = (typeof LocationType)[keyof typeof LocationType]


export const TxnType: {
  IN: 'IN',
  OUT: 'OUT',
  ADJUST: 'ADJUST'
};

export type TxnType = (typeof TxnType)[keyof typeof TxnType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Uom = $Enums.Uom

export const Uom: typeof $Enums.Uom

export type MachineType = $Enums.MachineType

export const MachineType: typeof $Enums.MachineType

export type MaterialType = $Enums.MaterialType

export const MaterialType: typeof $Enums.MaterialType

export type ItemKind = $Enums.ItemKind

export const ItemKind: typeof $Enums.ItemKind

export type ItemStatus = $Enums.ItemStatus

export const ItemStatus: typeof $Enums.ItemStatus

export type ProStatus = $Enums.ProStatus

export const ProStatus: typeof $Enums.ProStatus

export type ProType = $Enums.ProType

export const ProType: typeof $Enums.ProType

export type ReportStatus = $Enums.ReportStatus

export const ReportStatus: typeof $Enums.ReportStatus

export type LphType = $Enums.LphType

export const LphType: typeof $Enums.LphType

export type LocationType = $Enums.LocationType

export const LocationType: typeof $Enums.LocationType

export type TxnType = $Enums.TxnType

export const TxnType: typeof $Enums.TxnType

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
   * `prisma.item`: Exposes CRUD operations for the **Item** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Items
    * const items = await prisma.item.findMany()
    * ```
    */
  get item(): Prisma.ItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.proPrefix`: Exposes CRUD operations for the **ProPrefix** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProPrefixes
    * const proPrefixes = await prisma.proPrefix.findMany()
    * ```
    */
  get proPrefix(): Prisma.ProPrefixDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.proses`: Exposes CRUD operations for the **Proses** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Proses
    * const proses = await prisma.proses.findMany()
    * ```
    */
  get proses(): Prisma.ProsesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.prosesMaterial`: Exposes CRUD operations for the **ProsesMaterial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProsesMaterials
    * const prosesMaterials = await prisma.prosesMaterial.findMany()
    * ```
    */
  get prosesMaterial(): Prisma.ProsesMaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productionReport`: Exposes CRUD operations for the **ProductionReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductionReports
    * const productionReports = await prisma.productionReport.findMany()
    * ```
    */
  get productionReport(): Prisma.ProductionReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryLocation`: Exposes CRUD operations for the **InventoryLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryLocations
    * const inventoryLocations = await prisma.inventoryLocation.findMany()
    * ```
    */
  get inventoryLocation(): Prisma.InventoryLocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryTxn`: Exposes CRUD operations for the **InventoryTxn** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryTxns
    * const inventoryTxns = await prisma.inventoryTxn.findMany()
    * ```
    */
  get inventoryTxn(): Prisma.InventoryTxnDelegate<ExtArgs, ClientOptions>;
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
    Item: 'Item',
    ProPrefix: 'ProPrefix',
    ProSequence: 'ProSequence',
    Pro: 'Pro',
    Proses: 'Proses',
    ProsesMaterial: 'ProsesMaterial',
    ProductionReport: 'ProductionReport',
    InventoryLocation: 'InventoryLocation',
    InventoryTxn: 'InventoryTxn'
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
      modelProps: "user" | "machine" | "material" | "item" | "proPrefix" | "proSequence" | "pro" | "proses" | "prosesMaterial" | "productionReport" | "inventoryLocation" | "inventoryTxn"
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
      Item: {
        payload: Prisma.$ItemPayload<ExtArgs>
        fields: Prisma.ItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findFirst: {
            args: Prisma.ItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findMany: {
            args: Prisma.ItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          create: {
            args: Prisma.ItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          createMany: {
            args: Prisma.ItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          update: {
            args: Prisma.ItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          deleteMany: {
            args: Prisma.ItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          aggregate: {
            args: Prisma.ItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItem>
          }
          groupBy: {
            args: Prisma.ItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemCountArgs<ExtArgs>
            result: $Utils.Optional<ItemCountAggregateOutputType> | number
          }
        }
      }
      ProPrefix: {
        payload: Prisma.$ProPrefixPayload<ExtArgs>
        fields: Prisma.ProPrefixFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProPrefixFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProPrefixFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          findFirst: {
            args: Prisma.ProPrefixFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProPrefixFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          findMany: {
            args: Prisma.ProPrefixFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>[]
          }
          create: {
            args: Prisma.ProPrefixCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          createMany: {
            args: Prisma.ProPrefixCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProPrefixDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          update: {
            args: Prisma.ProPrefixUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          deleteMany: {
            args: Prisma.ProPrefixDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProPrefixUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProPrefixUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProPrefixPayload>
          }
          aggregate: {
            args: Prisma.ProPrefixAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProPrefix>
          }
          groupBy: {
            args: Prisma.ProPrefixGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProPrefixGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProPrefixCountArgs<ExtArgs>
            result: $Utils.Optional<ProPrefixCountAggregateOutputType> | number
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
      Proses: {
        payload: Prisma.$ProsesPayload<ExtArgs>
        fields: Prisma.ProsesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProsesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProsesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          findFirst: {
            args: Prisma.ProsesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProsesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          findMany: {
            args: Prisma.ProsesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>[]
          }
          create: {
            args: Prisma.ProsesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          createMany: {
            args: Prisma.ProsesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProsesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          update: {
            args: Prisma.ProsesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          deleteMany: {
            args: Prisma.ProsesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProsesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProsesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesPayload>
          }
          aggregate: {
            args: Prisma.ProsesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProses>
          }
          groupBy: {
            args: Prisma.ProsesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProsesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProsesCountArgs<ExtArgs>
            result: $Utils.Optional<ProsesCountAggregateOutputType> | number
          }
        }
      }
      ProsesMaterial: {
        payload: Prisma.$ProsesMaterialPayload<ExtArgs>
        fields: Prisma.ProsesMaterialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProsesMaterialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProsesMaterialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          findFirst: {
            args: Prisma.ProsesMaterialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProsesMaterialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          findMany: {
            args: Prisma.ProsesMaterialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>[]
          }
          create: {
            args: Prisma.ProsesMaterialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          createMany: {
            args: Prisma.ProsesMaterialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProsesMaterialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          update: {
            args: Prisma.ProsesMaterialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          deleteMany: {
            args: Prisma.ProsesMaterialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProsesMaterialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProsesMaterialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProsesMaterialPayload>
          }
          aggregate: {
            args: Prisma.ProsesMaterialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProsesMaterial>
          }
          groupBy: {
            args: Prisma.ProsesMaterialGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProsesMaterialGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProsesMaterialCountArgs<ExtArgs>
            result: $Utils.Optional<ProsesMaterialCountAggregateOutputType> | number
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
      InventoryLocation: {
        payload: Prisma.$InventoryLocationPayload<ExtArgs>
        fields: Prisma.InventoryLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          findFirst: {
            args: Prisma.InventoryLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          findMany: {
            args: Prisma.InventoryLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>[]
          }
          create: {
            args: Prisma.InventoryLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          createMany: {
            args: Prisma.InventoryLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InventoryLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          update: {
            args: Prisma.InventoryLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          deleteMany: {
            args: Prisma.InventoryLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLocationPayload>
          }
          aggregate: {
            args: Prisma.InventoryLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryLocation>
          }
          groupBy: {
            args: Prisma.InventoryLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryLocationCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryLocationCountAggregateOutputType> | number
          }
        }
      }
      InventoryTxn: {
        payload: Prisma.$InventoryTxnPayload<ExtArgs>
        fields: Prisma.InventoryTxnFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryTxnFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryTxnFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          findFirst: {
            args: Prisma.InventoryTxnFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryTxnFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          findMany: {
            args: Prisma.InventoryTxnFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>[]
          }
          create: {
            args: Prisma.InventoryTxnCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          createMany: {
            args: Prisma.InventoryTxnCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InventoryTxnDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          update: {
            args: Prisma.InventoryTxnUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          deleteMany: {
            args: Prisma.InventoryTxnDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryTxnUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryTxnUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryTxnPayload>
          }
          aggregate: {
            args: Prisma.InventoryTxnAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryTxn>
          }
          groupBy: {
            args: Prisma.InventoryTxnGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryTxnGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryTxnCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryTxnCountAggregateOutputType> | number
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
    item?: ItemOmit
    proPrefix?: ProPrefixOmit
    proSequence?: ProSequenceOmit
    pro?: ProOmit
    proses?: ProsesOmit
    prosesMaterial?: ProsesMaterialOmit
    productionReport?: ProductionReportOmit
    inventoryLocation?: InventoryLocationOmit
    inventoryTxn?: InventoryTxnOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    productionReports: number
    checkedProductionReports: number
    createdItems: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productionReports?: boolean | UserCountOutputTypeCountProductionReportsArgs
    checkedProductionReports?: boolean | UserCountOutputTypeCountCheckedProductionReportsArgs
    createdItems?: boolean | UserCountOutputTypeCountCreatedItemsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProductionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionReportWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCheckedProductionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionReportWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
  }


  /**
   * Count Type MachineCountOutputType
   */

  export type MachineCountOutputType = {
    proses: number
  }

  export type MachineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proses?: boolean | MachineCountOutputTypeCountProsesArgs
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
  export type MachineCountOutputTypeCountProsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesWhereInput
  }


  /**
   * Count Type MaterialCountOutputType
   */

  export type MaterialCountOutputType = {
    prosesMaterials: number
  }

  export type MaterialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prosesMaterials?: boolean | MaterialCountOutputTypeCountProsesMaterialsArgs
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
  export type MaterialCountOutputTypeCountProsesMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesMaterialWhereInput
  }


  /**
   * Count Type ItemCountOutputType
   */

  export type ItemCountOutputType = {
    inventoryTxns: number
    fgPros: number
    outputProses: number
  }

  export type ItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryTxns?: boolean | ItemCountOutputTypeCountInventoryTxnsArgs
    fgPros?: boolean | ItemCountOutputTypeCountFgProsArgs
    outputProses?: boolean | ItemCountOutputTypeCountOutputProsesArgs
  }

  // Custom InputTypes
  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemCountOutputType
     */
    select?: ItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountInventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountFgProsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProWhereInput
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountOutputProsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesWhereInput
  }


  /**
   * Count Type ProPrefixCountOutputType
   */

  export type ProPrefixCountOutputType = {
    pros: number
  }

  export type ProPrefixCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pros?: boolean | ProPrefixCountOutputTypeCountProsArgs
  }

  // Custom InputTypes
  /**
   * ProPrefixCountOutputType without action
   */
  export type ProPrefixCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefixCountOutputType
     */
    select?: ProPrefixCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProPrefixCountOutputType without action
   */
  export type ProPrefixCountOutputTypeCountProsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProWhereInput
  }


  /**
   * Count Type ProCountOutputType
   */

  export type ProCountOutputType = {
    proses: number
    inventoryTxns: number
  }

  export type ProCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proses?: boolean | ProCountOutputTypeCountProsesArgs
    inventoryTxns?: boolean | ProCountOutputTypeCountInventoryTxnsArgs
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
  export type ProCountOutputTypeCountProsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesWhereInput
  }

  /**
   * ProCountOutputType without action
   */
  export type ProCountOutputTypeCountInventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
  }


  /**
   * Count Type ProsesCountOutputType
   */

  export type ProsesCountOutputType = {
    materials: number
    productionReports: number
    inventoryTxns: number
  }

  export type ProsesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    materials?: boolean | ProsesCountOutputTypeCountMaterialsArgs
    productionReports?: boolean | ProsesCountOutputTypeCountProductionReportsArgs
    inventoryTxns?: boolean | ProsesCountOutputTypeCountInventoryTxnsArgs
  }

  // Custom InputTypes
  /**
   * ProsesCountOutputType without action
   */
  export type ProsesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesCountOutputType
     */
    select?: ProsesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProsesCountOutputType without action
   */
  export type ProsesCountOutputTypeCountMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesMaterialWhereInput
  }

  /**
   * ProsesCountOutputType without action
   */
  export type ProsesCountOutputTypeCountProductionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionReportWhereInput
  }

  /**
   * ProsesCountOutputType without action
   */
  export type ProsesCountOutputTypeCountInventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
  }


  /**
   * Count Type ProductionReportCountOutputType
   */

  export type ProductionReportCountOutputType = {
    inventoryTxns: number
  }

  export type ProductionReportCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryTxns?: boolean | ProductionReportCountOutputTypeCountInventoryTxnsArgs
  }

  // Custom InputTypes
  /**
   * ProductionReportCountOutputType without action
   */
  export type ProductionReportCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionReportCountOutputType
     */
    select?: ProductionReportCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductionReportCountOutputType without action
   */
  export type ProductionReportCountOutputTypeCountInventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
  }


  /**
   * Count Type InventoryLocationCountOutputType
   */

  export type InventoryLocationCountOutputType = {
    txns: number
  }

  export type InventoryLocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    txns?: boolean | InventoryLocationCountOutputTypeCountTxnsArgs
  }

  // Custom InputTypes
  /**
   * InventoryLocationCountOutputType without action
   */
  export type InventoryLocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocationCountOutputType
     */
    select?: InventoryLocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryLocationCountOutputType without action
   */
  export type InventoryLocationCountOutputTypeCountTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
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
    department: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    department: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    passwordHash: number
    role: number
    department: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    department?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    department?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    role?: true
    department?: true
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
    department: string | null
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
    department?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    productionReports?: boolean | User$productionReportsArgs<ExtArgs>
    checkedProductionReports?: boolean | User$checkedProductionReportsArgs<ExtArgs>
    createdItems?: boolean | User$createdItemsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    department?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "passwordHash" | "role" | "department" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productionReports?: boolean | User$productionReportsArgs<ExtArgs>
    checkedProductionReports?: boolean | User$checkedProductionReportsArgs<ExtArgs>
    createdItems?: boolean | User$createdItemsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      productionReports: Prisma.$ProductionReportPayload<ExtArgs>[]
      checkedProductionReports: Prisma.$ProductionReportPayload<ExtArgs>[]
      createdItems: Prisma.$ItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      passwordHash: string
      role: $Enums.Role
      department: string | null
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
    productionReports<T extends User$productionReportsArgs<ExtArgs> = {}>(args?: Subset<T, User$productionReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    checkedProductionReports<T extends User$checkedProductionReportsArgs<ExtArgs> = {}>(args?: Subset<T, User$checkedProductionReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdItems<T extends User$createdItemsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly department: FieldRef<"User", 'String'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.productionReports
   */
  export type User$productionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * User.checkedProductionReports
   */
  export type User$checkedProductionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * User.createdItems
   */
  export type User$createdItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    cursor?: ItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
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
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
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
    cycleTimeSec: number
    cycleTimeMin: number
    cavity: number
    manPower: number
    stdOutputPerDay: number
    workCenter: number
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
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
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
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
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
    cycleTimeSec?: true
    cycleTimeMin?: true
    cavity?: true
    manPower?: true
    stdOutputPerDay?: true
    workCenter?: true
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
    cycleTimeSec: Decimal | null
    cycleTimeMin: Decimal | null
    cavity: number | null
    manPower: number | null
    stdOutputPerDay: number | null
    workCenter: string | null
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
    cycleTimeSec?: boolean
    cycleTimeMin?: boolean
    cavity?: boolean
    manPower?: boolean
    stdOutputPerDay?: boolean
    workCenter?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    proses?: boolean | Machine$prosesArgs<ExtArgs>
    location?: boolean | Machine$locationArgs<ExtArgs>
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
    cycleTimeSec?: boolean
    cycleTimeMin?: boolean
    cavity?: boolean
    manPower?: boolean
    stdOutputPerDay?: boolean
    workCenter?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MachineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "stdOutputPerHour" | "stdOutputPerShift" | "uom" | "type" | "remark" | "cycleTimeSec" | "cycleTimeMin" | "cavity" | "manPower" | "stdOutputPerDay" | "workCenter" | "createdAt" | "updatedAt", ExtArgs["result"]["machine"]>
  export type MachineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proses?: boolean | Machine$prosesArgs<ExtArgs>
    location?: boolean | Machine$locationArgs<ExtArgs>
    _count?: boolean | MachineCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MachinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Machine"
    objects: {
      proses: Prisma.$ProsesPayload<ExtArgs>[]
      location: Prisma.$InventoryLocationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      stdOutputPerHour: number
      stdOutputPerShift: number
      uom: $Enums.Uom
      type: $Enums.MachineType
      remark: string | null
      cycleTimeSec: Prisma.Decimal | null
      cycleTimeMin: Prisma.Decimal | null
      cavity: number | null
      manPower: number | null
      stdOutputPerDay: number | null
      workCenter: string | null
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
    proses<T extends Machine$prosesArgs<ExtArgs> = {}>(args?: Subset<T, Machine$prosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    location<T extends Machine$locationArgs<ExtArgs> = {}>(args?: Subset<T, Machine$locationArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
    readonly cycleTimeSec: FieldRef<"Machine", 'Decimal'>
    readonly cycleTimeMin: FieldRef<"Machine", 'Decimal'>
    readonly cavity: FieldRef<"Machine", 'Int'>
    readonly manPower: FieldRef<"Machine", 'Int'>
    readonly stdOutputPerDay: FieldRef<"Machine", 'Int'>
    readonly workCenter: FieldRef<"Machine", 'String'>
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
   * Machine.proses
   */
  export type Machine$prosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    where?: ProsesWhereInput
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    cursor?: ProsesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Machine.location
   */
  export type Machine$locationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    where?: InventoryLocationWhereInput
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
    itemId: number | null
  }

  export type MaterialSumAggregateOutputType = {
    id: number | null
    itemId: number | null
  }

  export type MaterialMinAggregateOutputType = {
    id: number | null
    name: string | null
    uom: string | null
    type: $Enums.MaterialType | null
    createdAt: Date | null
    updatedAt: Date | null
    itemId: number | null
  }

  export type MaterialMaxAggregateOutputType = {
    id: number | null
    name: string | null
    uom: string | null
    type: $Enums.MaterialType | null
    createdAt: Date | null
    updatedAt: Date | null
    itemId: number | null
  }

  export type MaterialCountAggregateOutputType = {
    id: number
    name: number
    uom: number
    type: number
    createdAt: number
    updatedAt: number
    itemId: number
    _all: number
  }


  export type MaterialAvgAggregateInputType = {
    id?: true
    itemId?: true
  }

  export type MaterialSumAggregateInputType = {
    id?: true
    itemId?: true
  }

  export type MaterialMinAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    itemId?: true
  }

  export type MaterialMaxAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    itemId?: true
  }

  export type MaterialCountAggregateInputType = {
    id?: true
    name?: true
    uom?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    itemId?: true
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
    type: $Enums.MaterialType
    createdAt: Date
    updatedAt: Date
    itemId: number | null
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
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    itemId?: boolean
    prosesMaterials?: boolean | Material$prosesMaterialsArgs<ExtArgs>
    item?: boolean | Material$itemArgs<ExtArgs>
    _count?: boolean | MaterialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["material"]>



  export type MaterialSelectScalar = {
    id?: boolean
    name?: boolean
    uom?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    itemId?: boolean
  }

  export type MaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "uom" | "type" | "createdAt" | "updatedAt" | "itemId", ExtArgs["result"]["material"]>
  export type MaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prosesMaterials?: boolean | Material$prosesMaterialsArgs<ExtArgs>
    item?: boolean | Material$itemArgs<ExtArgs>
    _count?: boolean | MaterialCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Material"
    objects: {
      prosesMaterials: Prisma.$ProsesMaterialPayload<ExtArgs>[]
      item: Prisma.$ItemPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      uom: string
      type: $Enums.MaterialType
      createdAt: Date
      updatedAt: Date
      itemId: number | null
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
    prosesMaterials<T extends Material$prosesMaterialsArgs<ExtArgs> = {}>(args?: Subset<T, Material$prosesMaterialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    item<T extends Material$itemArgs<ExtArgs> = {}>(args?: Subset<T, Material$itemArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
    readonly type: FieldRef<"Material", 'MaterialType'>
    readonly createdAt: FieldRef<"Material", 'DateTime'>
    readonly updatedAt: FieldRef<"Material", 'DateTime'>
    readonly itemId: FieldRef<"Material", 'Int'>
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
   * Material.prosesMaterials
   */
  export type Material$prosesMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    where?: ProsesMaterialWhereInput
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    cursor?: ProsesMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProsesMaterialScalarFieldEnum | ProsesMaterialScalarFieldEnum[]
  }

  /**
   * Material.item
   */
  export type Material$itemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
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
   * Model Item
   */

  export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  export type ItemAvgAggregateOutputType = {
    id: number | null
  }

  export type ItemSumAggregateOutputType = {
    id: number | null
  }

  export type ItemMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    kind: $Enums.ItemKind | null
    status: $Enums.ItemStatus | null
    baseUom: string | null
    createdById: string | null
    createdFrom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    kind: $Enums.ItemKind | null
    status: $Enums.ItemStatus | null
    baseUom: string | null
    createdById: string | null
    createdFrom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemCountAggregateOutputType = {
    id: number
    code: number
    name: number
    kind: number
    status: number
    baseUom: number
    createdById: number
    createdFrom: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemAvgAggregateInputType = {
    id?: true
  }

  export type ItemSumAggregateInputType = {
    id?: true
  }

  export type ItemMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    kind?: true
    status?: true
    baseUom?: true
    createdById?: true
    createdFrom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    kind?: true
    status?: true
    baseUom?: true
    createdById?: true
    createdFrom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    kind?: true
    status?: true
    baseUom?: true
    createdById?: true
    createdFrom?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Item to aggregate.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Items
    **/
    _count?: true | ItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemMaxAggregateInputType
  }

  export type GetItemAggregateType<T extends ItemAggregateArgs> = {
        [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItem[P]>
      : GetScalarType<T[P], AggregateItem[P]>
  }




  export type ItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithAggregationInput | ItemOrderByWithAggregationInput[]
    by: ItemScalarFieldEnum[] | ItemScalarFieldEnum
    having?: ItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemCountAggregateInputType | true
    _avg?: ItemAvgAggregateInputType
    _sum?: ItemSumAggregateInputType
    _min?: ItemMinAggregateInputType
    _max?: ItemMaxAggregateInputType
  }

  export type ItemGroupByOutputType = {
    id: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status: $Enums.ItemStatus
    baseUom: string | null
    createdById: string | null
    createdFrom: string | null
    createdAt: Date
    updatedAt: Date
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemGroupByOutputType[P]>
            : GetScalarType<T[P], ItemGroupByOutputType[P]>
        }
      >
    >


  export type ItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    kind?: boolean
    status?: boolean
    baseUom?: boolean
    createdById?: boolean
    createdFrom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | Item$createdByArgs<ExtArgs>
    inventoryTxns?: boolean | Item$inventoryTxnsArgs<ExtArgs>
    material?: boolean | Item$materialArgs<ExtArgs>
    fgPros?: boolean | Item$fgProsArgs<ExtArgs>
    outputProses?: boolean | Item$outputProsesArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["item"]>



  export type ItemSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    kind?: boolean
    status?: boolean
    baseUom?: boolean
    createdById?: boolean
    createdFrom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "kind" | "status" | "baseUom" | "createdById" | "createdFrom" | "createdAt" | "updatedAt", ExtArgs["result"]["item"]>
  export type ItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | Item$createdByArgs<ExtArgs>
    inventoryTxns?: boolean | Item$inventoryTxnsArgs<ExtArgs>
    material?: boolean | Item$materialArgs<ExtArgs>
    fgPros?: boolean | Item$fgProsArgs<ExtArgs>
    outputProses?: boolean | Item$outputProsesArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Item"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs> | null
      inventoryTxns: Prisma.$InventoryTxnPayload<ExtArgs>[]
      material: Prisma.$MaterialPayload<ExtArgs> | null
      fgPros: Prisma.$ProPayload<ExtArgs>[]
      outputProses: Prisma.$ProsesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      kind: $Enums.ItemKind
      status: $Enums.ItemStatus
      baseUom: string | null
      createdById: string | null
      createdFrom: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["item"]>
    composites: {}
  }

  type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = $Result.GetResult<Prisma.$ItemPayload, S>

  type ItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemCountAggregateInputType | true
    }

  export interface ItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Item'], meta: { name: 'Item' } }
    /**
     * Find zero or one Item that matches the filter.
     * @param {ItemFindUniqueArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemFindUniqueArgs>(args: SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Item that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemFindUniqueOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemFindFirstArgs>(args?: SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Items
     * const items = await prisma.item.findMany()
     * 
     * // Get first 10 Items
     * const items = await prisma.item.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemWithIdOnly = await prisma.item.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemFindManyArgs>(args?: SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Item.
     * @param {ItemCreateArgs} args - Arguments to create a Item.
     * @example
     * // Create one Item
     * const Item = await prisma.item.create({
     *   data: {
     *     // ... data to create a Item
     *   }
     * })
     * 
     */
    create<T extends ItemCreateArgs>(args: SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Items.
     * @param {ItemCreateManyArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemCreateManyArgs>(args?: SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Item.
     * @param {ItemDeleteArgs} args - Arguments to delete one Item.
     * @example
     * // Delete one Item
     * const Item = await prisma.item.delete({
     *   where: {
     *     // ... filter to delete one Item
     *   }
     * })
     * 
     */
    delete<T extends ItemDeleteArgs>(args: SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Item.
     * @param {ItemUpdateArgs} args - Arguments to update one Item.
     * @example
     * // Update one Item
     * const item = await prisma.item.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemUpdateArgs>(args: SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Items.
     * @param {ItemDeleteManyArgs} args - Arguments to filter Items to delete.
     * @example
     * // Delete a few Items
     * const { count } = await prisma.item.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemDeleteManyArgs>(args?: SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Items
     * const item = await prisma.item.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemUpdateManyArgs>(args: SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Item.
     * @param {ItemUpsertArgs} args - Arguments to update or create a Item.
     * @example
     * // Update or create a Item
     * const item = await prisma.item.upsert({
     *   create: {
     *     // ... data to create a Item
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Item we want to update
     *   }
     * })
     */
    upsert<T extends ItemUpsertArgs>(args: SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCountArgs} args - Arguments to filter Items to count.
     * @example
     * // Count the number of Items
     * const count = await prisma.item.count({
     *   where: {
     *     // ... the filter for the Items we want to count
     *   }
     * })
    **/
    count<T extends ItemCountArgs>(
      args?: Subset<T, ItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemAggregateArgs>(args: Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>

    /**
     * Group by Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemGroupByArgs} args - Group by arguments.
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
      T extends ItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemGroupByArgs['orderBy'] }
        : { orderBy?: ItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Item model
   */
  readonly fields: ItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Item.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends Item$createdByArgs<ExtArgs> = {}>(args?: Subset<T, Item$createdByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    inventoryTxns<T extends Item$inventoryTxnsArgs<ExtArgs> = {}>(args?: Subset<T, Item$inventoryTxnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    material<T extends Item$materialArgs<ExtArgs> = {}>(args?: Subset<T, Item$materialArgs<ExtArgs>>): Prisma__MaterialClient<$Result.GetResult<Prisma.$MaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    fgPros<T extends Item$fgProsArgs<ExtArgs> = {}>(args?: Subset<T, Item$fgProsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    outputProses<T extends Item$outputProsesArgs<ExtArgs> = {}>(args?: Subset<T, Item$outputProsesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Item model
   */
  interface ItemFieldRefs {
    readonly id: FieldRef<"Item", 'Int'>
    readonly code: FieldRef<"Item", 'String'>
    readonly name: FieldRef<"Item", 'String'>
    readonly kind: FieldRef<"Item", 'ItemKind'>
    readonly status: FieldRef<"Item", 'ItemStatus'>
    readonly baseUom: FieldRef<"Item", 'String'>
    readonly createdById: FieldRef<"Item", 'String'>
    readonly createdFrom: FieldRef<"Item", 'String'>
    readonly createdAt: FieldRef<"Item", 'DateTime'>
    readonly updatedAt: FieldRef<"Item", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Item findUnique
   */
  export type ItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findUniqueOrThrow
   */
  export type ItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findFirst
   */
  export type ItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findFirstOrThrow
   */
  export type ItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findMany
   */
  export type ItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Items to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item create
   */
  export type ItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to create a Item.
     */
    data: XOR<ItemCreateInput, ItemUncheckedCreateInput>
  }

  /**
   * Item createMany
   */
  export type ItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Item update
   */
  export type ItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to update a Item.
     */
    data: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
    /**
     * Choose, which Item to update.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item updateMany
   */
  export type ItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Items.
     */
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyInput>
    /**
     * Filter which Items to update
     */
    where?: ItemWhereInput
    /**
     * Limit how many Items to update.
     */
    limit?: number
  }

  /**
   * Item upsert
   */
  export type ItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The filter to search for the Item to update in case it exists.
     */
    where: ItemWhereUniqueInput
    /**
     * In case the Item found by the `where` argument doesn't exist, create a new Item with this data.
     */
    create: XOR<ItemCreateInput, ItemUncheckedCreateInput>
    /**
     * In case the Item was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
  }

  /**
   * Item delete
   */
  export type ItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter which Item to delete.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item deleteMany
   */
  export type ItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Items to delete
     */
    where?: ItemWhereInput
    /**
     * Limit how many Items to delete.
     */
    limit?: number
  }

  /**
   * Item.createdBy
   */
  export type Item$createdByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Item.inventoryTxns
   */
  export type Item$inventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    cursor?: InventoryTxnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * Item.material
   */
  export type Item$materialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    where?: MaterialWhereInput
  }

  /**
   * Item.fgPros
   */
  export type Item$fgProsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Item.outputProses
   */
  export type Item$outputProsesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    where?: ProsesWhereInput
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    cursor?: ProsesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Item without action
   */
  export type ItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
  }


  /**
   * Model ProPrefix
   */

  export type AggregateProPrefix = {
    _count: ProPrefixCountAggregateOutputType | null
    _avg: ProPrefixAvgAggregateOutputType | null
    _sum: ProPrefixSumAggregateOutputType | null
    _min: ProPrefixMinAggregateOutputType | null
    _max: ProPrefixMaxAggregateOutputType | null
  }

  export type ProPrefixAvgAggregateOutputType = {
    id: number | null
  }

  export type ProPrefixSumAggregateOutputType = {
    id: number | null
  }

  export type ProPrefixMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.ProType | null
  }

  export type ProPrefixMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.ProType | null
  }

  export type ProPrefixCountAggregateOutputType = {
    id: number
    code: number
    name: number
    type: number
    _all: number
  }


  export type ProPrefixAvgAggregateInputType = {
    id?: true
  }

  export type ProPrefixSumAggregateInputType = {
    id?: true
  }

  export type ProPrefixMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
  }

  export type ProPrefixMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
  }

  export type ProPrefixCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
    _all?: true
  }

  export type ProPrefixAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProPrefix to aggregate.
     */
    where?: ProPrefixWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProPrefixes to fetch.
     */
    orderBy?: ProPrefixOrderByWithRelationInput | ProPrefixOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProPrefixWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProPrefixes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProPrefixes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProPrefixes
    **/
    _count?: true | ProPrefixCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProPrefixAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProPrefixSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProPrefixMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProPrefixMaxAggregateInputType
  }

  export type GetProPrefixAggregateType<T extends ProPrefixAggregateArgs> = {
        [P in keyof T & keyof AggregateProPrefix]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProPrefix[P]>
      : GetScalarType<T[P], AggregateProPrefix[P]>
  }




  export type ProPrefixGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProPrefixWhereInput
    orderBy?: ProPrefixOrderByWithAggregationInput | ProPrefixOrderByWithAggregationInput[]
    by: ProPrefixScalarFieldEnum[] | ProPrefixScalarFieldEnum
    having?: ProPrefixScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProPrefixCountAggregateInputType | true
    _avg?: ProPrefixAvgAggregateInputType
    _sum?: ProPrefixSumAggregateInputType
    _min?: ProPrefixMinAggregateInputType
    _max?: ProPrefixMaxAggregateInputType
  }

  export type ProPrefixGroupByOutputType = {
    id: number
    code: string
    name: string
    type: $Enums.ProType
    _count: ProPrefixCountAggregateOutputType | null
    _avg: ProPrefixAvgAggregateOutputType | null
    _sum: ProPrefixSumAggregateOutputType | null
    _min: ProPrefixMinAggregateOutputType | null
    _max: ProPrefixMaxAggregateOutputType | null
  }

  type GetProPrefixGroupByPayload<T extends ProPrefixGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProPrefixGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProPrefixGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProPrefixGroupByOutputType[P]>
            : GetScalarType<T[P], ProPrefixGroupByOutputType[P]>
        }
      >
    >


  export type ProPrefixSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    pros?: boolean | ProPrefix$prosArgs<ExtArgs>
    _count?: boolean | ProPrefixCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proPrefix"]>



  export type ProPrefixSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
  }

  export type ProPrefixOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "type", ExtArgs["result"]["proPrefix"]>
  export type ProPrefixInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pros?: boolean | ProPrefix$prosArgs<ExtArgs>
    _count?: boolean | ProPrefixCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProPrefixPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProPrefix"
    objects: {
      pros: Prisma.$ProPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      type: $Enums.ProType
    }, ExtArgs["result"]["proPrefix"]>
    composites: {}
  }

  type ProPrefixGetPayload<S extends boolean | null | undefined | ProPrefixDefaultArgs> = $Result.GetResult<Prisma.$ProPrefixPayload, S>

  type ProPrefixCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProPrefixFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProPrefixCountAggregateInputType | true
    }

  export interface ProPrefixDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProPrefix'], meta: { name: 'ProPrefix' } }
    /**
     * Find zero or one ProPrefix that matches the filter.
     * @param {ProPrefixFindUniqueArgs} args - Arguments to find a ProPrefix
     * @example
     * // Get one ProPrefix
     * const proPrefix = await prisma.proPrefix.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProPrefixFindUniqueArgs>(args: SelectSubset<T, ProPrefixFindUniqueArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProPrefix that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProPrefixFindUniqueOrThrowArgs} args - Arguments to find a ProPrefix
     * @example
     * // Get one ProPrefix
     * const proPrefix = await prisma.proPrefix.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProPrefixFindUniqueOrThrowArgs>(args: SelectSubset<T, ProPrefixFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProPrefix that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixFindFirstArgs} args - Arguments to find a ProPrefix
     * @example
     * // Get one ProPrefix
     * const proPrefix = await prisma.proPrefix.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProPrefixFindFirstArgs>(args?: SelectSubset<T, ProPrefixFindFirstArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProPrefix that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixFindFirstOrThrowArgs} args - Arguments to find a ProPrefix
     * @example
     * // Get one ProPrefix
     * const proPrefix = await prisma.proPrefix.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProPrefixFindFirstOrThrowArgs>(args?: SelectSubset<T, ProPrefixFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProPrefixes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProPrefixes
     * const proPrefixes = await prisma.proPrefix.findMany()
     * 
     * // Get first 10 ProPrefixes
     * const proPrefixes = await prisma.proPrefix.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const proPrefixWithIdOnly = await prisma.proPrefix.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProPrefixFindManyArgs>(args?: SelectSubset<T, ProPrefixFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProPrefix.
     * @param {ProPrefixCreateArgs} args - Arguments to create a ProPrefix.
     * @example
     * // Create one ProPrefix
     * const ProPrefix = await prisma.proPrefix.create({
     *   data: {
     *     // ... data to create a ProPrefix
     *   }
     * })
     * 
     */
    create<T extends ProPrefixCreateArgs>(args: SelectSubset<T, ProPrefixCreateArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProPrefixes.
     * @param {ProPrefixCreateManyArgs} args - Arguments to create many ProPrefixes.
     * @example
     * // Create many ProPrefixes
     * const proPrefix = await prisma.proPrefix.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProPrefixCreateManyArgs>(args?: SelectSubset<T, ProPrefixCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProPrefix.
     * @param {ProPrefixDeleteArgs} args - Arguments to delete one ProPrefix.
     * @example
     * // Delete one ProPrefix
     * const ProPrefix = await prisma.proPrefix.delete({
     *   where: {
     *     // ... filter to delete one ProPrefix
     *   }
     * })
     * 
     */
    delete<T extends ProPrefixDeleteArgs>(args: SelectSubset<T, ProPrefixDeleteArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProPrefix.
     * @param {ProPrefixUpdateArgs} args - Arguments to update one ProPrefix.
     * @example
     * // Update one ProPrefix
     * const proPrefix = await prisma.proPrefix.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProPrefixUpdateArgs>(args: SelectSubset<T, ProPrefixUpdateArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProPrefixes.
     * @param {ProPrefixDeleteManyArgs} args - Arguments to filter ProPrefixes to delete.
     * @example
     * // Delete a few ProPrefixes
     * const { count } = await prisma.proPrefix.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProPrefixDeleteManyArgs>(args?: SelectSubset<T, ProPrefixDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProPrefixes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProPrefixes
     * const proPrefix = await prisma.proPrefix.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProPrefixUpdateManyArgs>(args: SelectSubset<T, ProPrefixUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProPrefix.
     * @param {ProPrefixUpsertArgs} args - Arguments to update or create a ProPrefix.
     * @example
     * // Update or create a ProPrefix
     * const proPrefix = await prisma.proPrefix.upsert({
     *   create: {
     *     // ... data to create a ProPrefix
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProPrefix we want to update
     *   }
     * })
     */
    upsert<T extends ProPrefixUpsertArgs>(args: SelectSubset<T, ProPrefixUpsertArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProPrefixes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixCountArgs} args - Arguments to filter ProPrefixes to count.
     * @example
     * // Count the number of ProPrefixes
     * const count = await prisma.proPrefix.count({
     *   where: {
     *     // ... the filter for the ProPrefixes we want to count
     *   }
     * })
    **/
    count<T extends ProPrefixCountArgs>(
      args?: Subset<T, ProPrefixCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProPrefixCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProPrefix.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProPrefixAggregateArgs>(args: Subset<T, ProPrefixAggregateArgs>): Prisma.PrismaPromise<GetProPrefixAggregateType<T>>

    /**
     * Group by ProPrefix.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProPrefixGroupByArgs} args - Group by arguments.
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
      T extends ProPrefixGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProPrefixGroupByArgs['orderBy'] }
        : { orderBy?: ProPrefixGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProPrefixGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProPrefixGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProPrefix model
   */
  readonly fields: ProPrefixFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProPrefix.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProPrefixClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pros<T extends ProPrefix$prosArgs<ExtArgs> = {}>(args?: Subset<T, ProPrefix$prosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ProPrefix model
   */
  interface ProPrefixFieldRefs {
    readonly id: FieldRef<"ProPrefix", 'Int'>
    readonly code: FieldRef<"ProPrefix", 'String'>
    readonly name: FieldRef<"ProPrefix", 'String'>
    readonly type: FieldRef<"ProPrefix", 'ProType'>
  }
    

  // Custom InputTypes
  /**
   * ProPrefix findUnique
   */
  export type ProPrefixFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter, which ProPrefix to fetch.
     */
    where: ProPrefixWhereUniqueInput
  }

  /**
   * ProPrefix findUniqueOrThrow
   */
  export type ProPrefixFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter, which ProPrefix to fetch.
     */
    where: ProPrefixWhereUniqueInput
  }

  /**
   * ProPrefix findFirst
   */
  export type ProPrefixFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter, which ProPrefix to fetch.
     */
    where?: ProPrefixWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProPrefixes to fetch.
     */
    orderBy?: ProPrefixOrderByWithRelationInput | ProPrefixOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProPrefixes.
     */
    cursor?: ProPrefixWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProPrefixes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProPrefixes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProPrefixes.
     */
    distinct?: ProPrefixScalarFieldEnum | ProPrefixScalarFieldEnum[]
  }

  /**
   * ProPrefix findFirstOrThrow
   */
  export type ProPrefixFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter, which ProPrefix to fetch.
     */
    where?: ProPrefixWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProPrefixes to fetch.
     */
    orderBy?: ProPrefixOrderByWithRelationInput | ProPrefixOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProPrefixes.
     */
    cursor?: ProPrefixWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProPrefixes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProPrefixes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProPrefixes.
     */
    distinct?: ProPrefixScalarFieldEnum | ProPrefixScalarFieldEnum[]
  }

  /**
   * ProPrefix findMany
   */
  export type ProPrefixFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter, which ProPrefixes to fetch.
     */
    where?: ProPrefixWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProPrefixes to fetch.
     */
    orderBy?: ProPrefixOrderByWithRelationInput | ProPrefixOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProPrefixes.
     */
    cursor?: ProPrefixWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProPrefixes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProPrefixes.
     */
    skip?: number
    distinct?: ProPrefixScalarFieldEnum | ProPrefixScalarFieldEnum[]
  }

  /**
   * ProPrefix create
   */
  export type ProPrefixCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * The data needed to create a ProPrefix.
     */
    data: XOR<ProPrefixCreateInput, ProPrefixUncheckedCreateInput>
  }

  /**
   * ProPrefix createMany
   */
  export type ProPrefixCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProPrefixes.
     */
    data: ProPrefixCreateManyInput | ProPrefixCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProPrefix update
   */
  export type ProPrefixUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * The data needed to update a ProPrefix.
     */
    data: XOR<ProPrefixUpdateInput, ProPrefixUncheckedUpdateInput>
    /**
     * Choose, which ProPrefix to update.
     */
    where: ProPrefixWhereUniqueInput
  }

  /**
   * ProPrefix updateMany
   */
  export type ProPrefixUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProPrefixes.
     */
    data: XOR<ProPrefixUpdateManyMutationInput, ProPrefixUncheckedUpdateManyInput>
    /**
     * Filter which ProPrefixes to update
     */
    where?: ProPrefixWhereInput
    /**
     * Limit how many ProPrefixes to update.
     */
    limit?: number
  }

  /**
   * ProPrefix upsert
   */
  export type ProPrefixUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * The filter to search for the ProPrefix to update in case it exists.
     */
    where: ProPrefixWhereUniqueInput
    /**
     * In case the ProPrefix found by the `where` argument doesn't exist, create a new ProPrefix with this data.
     */
    create: XOR<ProPrefixCreateInput, ProPrefixUncheckedCreateInput>
    /**
     * In case the ProPrefix was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProPrefixUpdateInput, ProPrefixUncheckedUpdateInput>
  }

  /**
   * ProPrefix delete
   */
  export type ProPrefixDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    /**
     * Filter which ProPrefix to delete.
     */
    where: ProPrefixWhereUniqueInput
  }

  /**
   * ProPrefix deleteMany
   */
  export type ProPrefixDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProPrefixes to delete
     */
    where?: ProPrefixWhereInput
    /**
     * Limit how many ProPrefixes to delete.
     */
    limit?: number
  }

  /**
   * ProPrefix.pros
   */
  export type ProPrefix$prosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * ProPrefix without action
   */
  export type ProPrefixDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
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
    proPrefixId: number | null
    fgItemId: number | null
  }

  export type ProSumAggregateOutputType = {
    id: number | null
    qtyPoPcs: number | null
    proPrefixId: number | null
    fgItemId: number | null
  }

  export type ProMinAggregateOutputType = {
    id: number | null
    proNumber: string | null
    productName: string | null
    partNumber: string | null
    qtyPoPcs: number | null
    startDate: Date | null
    status: $Enums.ProStatus | null
    type: $Enums.ProType | null
    autoShiftExpansion: boolean | null
    proPrefixId: number | null
    fgItemId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProMaxAggregateOutputType = {
    id: number | null
    proNumber: string | null
    productName: string | null
    partNumber: string | null
    qtyPoPcs: number | null
    startDate: Date | null
    status: $Enums.ProStatus | null
    type: $Enums.ProType | null
    autoShiftExpansion: boolean | null
    proPrefixId: number | null
    fgItemId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProCountAggregateOutputType = {
    id: number
    proNumber: number
    productName: number
    partNumber: number
    qtyPoPcs: number
    startDate: number
    status: number
    type: number
    autoShiftExpansion: number
    proPrefixId: number
    fgItemId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProAvgAggregateInputType = {
    id?: true
    qtyPoPcs?: true
    proPrefixId?: true
    fgItemId?: true
  }

  export type ProSumAggregateInputType = {
    id?: true
    qtyPoPcs?: true
    proPrefixId?: true
    fgItemId?: true
  }

  export type ProMinAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    partNumber?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    proPrefixId?: true
    fgItemId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProMaxAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    partNumber?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    proPrefixId?: true
    fgItemId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProCountAggregateInputType = {
    id?: true
    proNumber?: true
    productName?: true
    partNumber?: true
    qtyPoPcs?: true
    startDate?: true
    status?: true
    type?: true
    autoShiftExpansion?: true
    proPrefixId?: true
    fgItemId?: true
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
    partNumber: string | null
    qtyPoPcs: number
    startDate: Date | null
    status: $Enums.ProStatus
    type: $Enums.ProType
    autoShiftExpansion: boolean
    proPrefixId: number | null
    fgItemId: number | null
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
    partNumber?: boolean
    qtyPoPcs?: boolean
    startDate?: boolean
    status?: boolean
    type?: boolean
    autoShiftExpansion?: boolean
    proPrefixId?: boolean
    fgItemId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    proPrefix?: boolean | Pro$proPrefixArgs<ExtArgs>
    fgItem?: boolean | Pro$fgItemArgs<ExtArgs>
    proses?: boolean | Pro$prosesArgs<ExtArgs>
    inventoryTxns?: boolean | Pro$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pro"]>



  export type ProSelectScalar = {
    id?: boolean
    proNumber?: boolean
    productName?: boolean
    partNumber?: boolean
    qtyPoPcs?: boolean
    startDate?: boolean
    status?: boolean
    type?: boolean
    autoShiftExpansion?: boolean
    proPrefixId?: boolean
    fgItemId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proNumber" | "productName" | "partNumber" | "qtyPoPcs" | "startDate" | "status" | "type" | "autoShiftExpansion" | "proPrefixId" | "fgItemId" | "createdAt" | "updatedAt", ExtArgs["result"]["pro"]>
  export type ProInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proPrefix?: boolean | Pro$proPrefixArgs<ExtArgs>
    fgItem?: boolean | Pro$fgItemArgs<ExtArgs>
    proses?: boolean | Pro$prosesArgs<ExtArgs>
    inventoryTxns?: boolean | Pro$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pro"
    objects: {
      proPrefix: Prisma.$ProPrefixPayload<ExtArgs> | null
      fgItem: Prisma.$ItemPayload<ExtArgs> | null
      proses: Prisma.$ProsesPayload<ExtArgs>[]
      inventoryTxns: Prisma.$InventoryTxnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      proNumber: string
      productName: string
      partNumber: string | null
      qtyPoPcs: number
      startDate: Date | null
      status: $Enums.ProStatus
      type: $Enums.ProType
      autoShiftExpansion: boolean
      proPrefixId: number | null
      fgItemId: number | null
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
    proPrefix<T extends Pro$proPrefixArgs<ExtArgs> = {}>(args?: Subset<T, Pro$proPrefixArgs<ExtArgs>>): Prisma__ProPrefixClient<$Result.GetResult<Prisma.$ProPrefixPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    fgItem<T extends Pro$fgItemArgs<ExtArgs> = {}>(args?: Subset<T, Pro$fgItemArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    proses<T extends Pro$prosesArgs<ExtArgs> = {}>(args?: Subset<T, Pro$prosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventoryTxns<T extends Pro$inventoryTxnsArgs<ExtArgs> = {}>(args?: Subset<T, Pro$inventoryTxnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly partNumber: FieldRef<"Pro", 'String'>
    readonly qtyPoPcs: FieldRef<"Pro", 'Int'>
    readonly startDate: FieldRef<"Pro", 'DateTime'>
    readonly status: FieldRef<"Pro", 'ProStatus'>
    readonly type: FieldRef<"Pro", 'ProType'>
    readonly autoShiftExpansion: FieldRef<"Pro", 'Boolean'>
    readonly proPrefixId: FieldRef<"Pro", 'Int'>
    readonly fgItemId: FieldRef<"Pro", 'Int'>
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
   * Pro.proPrefix
   */
  export type Pro$proPrefixArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProPrefix
     */
    select?: ProPrefixSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProPrefix
     */
    omit?: ProPrefixOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProPrefixInclude<ExtArgs> | null
    where?: ProPrefixWhereInput
  }

  /**
   * Pro.fgItem
   */
  export type Pro$fgItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
  }

  /**
   * Pro.proses
   */
  export type Pro$prosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    where?: ProsesWhereInput
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    cursor?: ProsesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Pro.inventoryTxns
   */
  export type Pro$inventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    cursor?: InventoryTxnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
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
   * Model Proses
   */

  export type AggregateProses = {
    _count: ProsesCountAggregateOutputType | null
    _avg: ProsesAvgAggregateOutputType | null
    _sum: ProsesSumAggregateOutputType | null
    _min: ProsesMinAggregateOutputType | null
    _max: ProsesMaxAggregateOutputType | null
  }

  export type ProsesAvgAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    machineId: number | null
    outputItemId: number | null
  }

  export type ProsesSumAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    machineId: number | null
    outputItemId: number | null
  }

  export type ProsesMinAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    batchNo: string | null
    outputItemId: number | null
  }

  export type ProsesMaxAggregateOutputType = {
    id: number | null
    proId: number | null
    orderNo: number | null
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    batchNo: string | null
    outputItemId: number | null
  }

  export type ProsesCountAggregateOutputType = {
    id: number
    proId: number
    orderNo: number
    up: number
    estimatedShifts: number
    startDate: number
    machineId: number
    partNumber: number
    batchNo: number
    outputItemId: number
    _all: number
  }


  export type ProsesAvgAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    machineId?: true
    outputItemId?: true
  }

  export type ProsesSumAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    machineId?: true
    outputItemId?: true
  }

  export type ProsesMinAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    batchNo?: true
    outputItemId?: true
  }

  export type ProsesMaxAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    batchNo?: true
    outputItemId?: true
  }

  export type ProsesCountAggregateInputType = {
    id?: true
    proId?: true
    orderNo?: true
    up?: true
    estimatedShifts?: true
    startDate?: true
    machineId?: true
    partNumber?: true
    batchNo?: true
    outputItemId?: true
    _all?: true
  }

  export type ProsesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Proses to aggregate.
     */
    where?: ProsesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proses to fetch.
     */
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProsesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Proses
    **/
    _count?: true | ProsesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProsesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProsesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProsesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProsesMaxAggregateInputType
  }

  export type GetProsesAggregateType<T extends ProsesAggregateArgs> = {
        [P in keyof T & keyof AggregateProses]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProses[P]>
      : GetScalarType<T[P], AggregateProses[P]>
  }




  export type ProsesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesWhereInput
    orderBy?: ProsesOrderByWithAggregationInput | ProsesOrderByWithAggregationInput[]
    by: ProsesScalarFieldEnum[] | ProsesScalarFieldEnum
    having?: ProsesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProsesCountAggregateInputType | true
    _avg?: ProsesAvgAggregateInputType
    _sum?: ProsesSumAggregateInputType
    _min?: ProsesMinAggregateInputType
    _max?: ProsesMaxAggregateInputType
  }

  export type ProsesGroupByOutputType = {
    id: number
    proId: number
    orderNo: number
    up: number | null
    estimatedShifts: number | null
    startDate: Date | null
    machineId: number | null
    partNumber: string | null
    batchNo: string | null
    outputItemId: number | null
    _count: ProsesCountAggregateOutputType | null
    _avg: ProsesAvgAggregateOutputType | null
    _sum: ProsesSumAggregateOutputType | null
    _min: ProsesMinAggregateOutputType | null
    _max: ProsesMaxAggregateOutputType | null
  }

  type GetProsesGroupByPayload<T extends ProsesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProsesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProsesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProsesGroupByOutputType[P]>
            : GetScalarType<T[P], ProsesGroupByOutputType[P]>
        }
      >
    >


  export type ProsesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    proId?: boolean
    orderNo?: boolean
    up?: boolean
    estimatedShifts?: boolean
    startDate?: boolean
    machineId?: boolean
    partNumber?: boolean
    batchNo?: boolean
    outputItemId?: boolean
    pro?: boolean | ProDefaultArgs<ExtArgs>
    machine?: boolean | Proses$machineArgs<ExtArgs>
    outputItem?: boolean | Proses$outputItemArgs<ExtArgs>
    materials?: boolean | Proses$materialsArgs<ExtArgs>
    productionReports?: boolean | Proses$productionReportsArgs<ExtArgs>
    inventoryTxns?: boolean | Proses$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProsesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proses"]>



  export type ProsesSelectScalar = {
    id?: boolean
    proId?: boolean
    orderNo?: boolean
    up?: boolean
    estimatedShifts?: boolean
    startDate?: boolean
    machineId?: boolean
    partNumber?: boolean
    batchNo?: boolean
    outputItemId?: boolean
  }

  export type ProsesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "proId" | "orderNo" | "up" | "estimatedShifts" | "startDate" | "machineId" | "partNumber" | "batchNo" | "outputItemId", ExtArgs["result"]["proses"]>
  export type ProsesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pro?: boolean | ProDefaultArgs<ExtArgs>
    machine?: boolean | Proses$machineArgs<ExtArgs>
    outputItem?: boolean | Proses$outputItemArgs<ExtArgs>
    materials?: boolean | Proses$materialsArgs<ExtArgs>
    productionReports?: boolean | Proses$productionReportsArgs<ExtArgs>
    inventoryTxns?: boolean | Proses$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProsesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProsesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Proses"
    objects: {
      pro: Prisma.$ProPayload<ExtArgs>
      machine: Prisma.$MachinePayload<ExtArgs> | null
      outputItem: Prisma.$ItemPayload<ExtArgs> | null
      materials: Prisma.$ProsesMaterialPayload<ExtArgs>[]
      productionReports: Prisma.$ProductionReportPayload<ExtArgs>[]
      inventoryTxns: Prisma.$InventoryTxnPayload<ExtArgs>[]
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
      batchNo: string | null
      outputItemId: number | null
    }, ExtArgs["result"]["proses"]>
    composites: {}
  }

  type ProsesGetPayload<S extends boolean | null | undefined | ProsesDefaultArgs> = $Result.GetResult<Prisma.$ProsesPayload, S>

  type ProsesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProsesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProsesCountAggregateInputType | true
    }

  export interface ProsesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Proses'], meta: { name: 'Proses' } }
    /**
     * Find zero or one Proses that matches the filter.
     * @param {ProsesFindUniqueArgs} args - Arguments to find a Proses
     * @example
     * // Get one Proses
     * const proses = await prisma.proses.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProsesFindUniqueArgs>(args: SelectSubset<T, ProsesFindUniqueArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Proses that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProsesFindUniqueOrThrowArgs} args - Arguments to find a Proses
     * @example
     * // Get one Proses
     * const proses = await prisma.proses.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProsesFindUniqueOrThrowArgs>(args: SelectSubset<T, ProsesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Proses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesFindFirstArgs} args - Arguments to find a Proses
     * @example
     * // Get one Proses
     * const proses = await prisma.proses.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProsesFindFirstArgs>(args?: SelectSubset<T, ProsesFindFirstArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Proses that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesFindFirstOrThrowArgs} args - Arguments to find a Proses
     * @example
     * // Get one Proses
     * const proses = await prisma.proses.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProsesFindFirstOrThrowArgs>(args?: SelectSubset<T, ProsesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Proses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Proses
     * const proses = await prisma.proses.findMany()
     * 
     * // Get first 10 Proses
     * const proses = await prisma.proses.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prosesWithIdOnly = await prisma.proses.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProsesFindManyArgs>(args?: SelectSubset<T, ProsesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Proses.
     * @param {ProsesCreateArgs} args - Arguments to create a Proses.
     * @example
     * // Create one Proses
     * const Proses = await prisma.proses.create({
     *   data: {
     *     // ... data to create a Proses
     *   }
     * })
     * 
     */
    create<T extends ProsesCreateArgs>(args: SelectSubset<T, ProsesCreateArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Proses.
     * @param {ProsesCreateManyArgs} args - Arguments to create many Proses.
     * @example
     * // Create many Proses
     * const proses = await prisma.proses.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProsesCreateManyArgs>(args?: SelectSubset<T, ProsesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Proses.
     * @param {ProsesDeleteArgs} args - Arguments to delete one Proses.
     * @example
     * // Delete one Proses
     * const Proses = await prisma.proses.delete({
     *   where: {
     *     // ... filter to delete one Proses
     *   }
     * })
     * 
     */
    delete<T extends ProsesDeleteArgs>(args: SelectSubset<T, ProsesDeleteArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Proses.
     * @param {ProsesUpdateArgs} args - Arguments to update one Proses.
     * @example
     * // Update one Proses
     * const proses = await prisma.proses.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProsesUpdateArgs>(args: SelectSubset<T, ProsesUpdateArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Proses.
     * @param {ProsesDeleteManyArgs} args - Arguments to filter Proses to delete.
     * @example
     * // Delete a few Proses
     * const { count } = await prisma.proses.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProsesDeleteManyArgs>(args?: SelectSubset<T, ProsesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Proses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Proses
     * const proses = await prisma.proses.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProsesUpdateManyArgs>(args: SelectSubset<T, ProsesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Proses.
     * @param {ProsesUpsertArgs} args - Arguments to update or create a Proses.
     * @example
     * // Update or create a Proses
     * const proses = await prisma.proses.upsert({
     *   create: {
     *     // ... data to create a Proses
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Proses we want to update
     *   }
     * })
     */
    upsert<T extends ProsesUpsertArgs>(args: SelectSubset<T, ProsesUpsertArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Proses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesCountArgs} args - Arguments to filter Proses to count.
     * @example
     * // Count the number of Proses
     * const count = await prisma.proses.count({
     *   where: {
     *     // ... the filter for the Proses we want to count
     *   }
     * })
    **/
    count<T extends ProsesCountArgs>(
      args?: Subset<T, ProsesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProsesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Proses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProsesAggregateArgs>(args: Subset<T, ProsesAggregateArgs>): Prisma.PrismaPromise<GetProsesAggregateType<T>>

    /**
     * Group by Proses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesGroupByArgs} args - Group by arguments.
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
      T extends ProsesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProsesGroupByArgs['orderBy'] }
        : { orderBy?: ProsesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProsesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProsesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Proses model
   */
  readonly fields: ProsesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Proses.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProsesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pro<T extends ProDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProDefaultArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    machine<T extends Proses$machineArgs<ExtArgs> = {}>(args?: Subset<T, Proses$machineArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    outputItem<T extends Proses$outputItemArgs<ExtArgs> = {}>(args?: Subset<T, Proses$outputItemArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    materials<T extends Proses$materialsArgs<ExtArgs> = {}>(args?: Subset<T, Proses$materialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    productionReports<T extends Proses$productionReportsArgs<ExtArgs> = {}>(args?: Subset<T, Proses$productionReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventoryTxns<T extends Proses$inventoryTxnsArgs<ExtArgs> = {}>(args?: Subset<T, Proses$inventoryTxnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Proses model
   */
  interface ProsesFieldRefs {
    readonly id: FieldRef<"Proses", 'Int'>
    readonly proId: FieldRef<"Proses", 'Int'>
    readonly orderNo: FieldRef<"Proses", 'Int'>
    readonly up: FieldRef<"Proses", 'Int'>
    readonly estimatedShifts: FieldRef<"Proses", 'Int'>
    readonly startDate: FieldRef<"Proses", 'DateTime'>
    readonly machineId: FieldRef<"Proses", 'Int'>
    readonly partNumber: FieldRef<"Proses", 'String'>
    readonly batchNo: FieldRef<"Proses", 'String'>
    readonly outputItemId: FieldRef<"Proses", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Proses findUnique
   */
  export type ProsesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter, which Proses to fetch.
     */
    where: ProsesWhereUniqueInput
  }

  /**
   * Proses findUniqueOrThrow
   */
  export type ProsesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter, which Proses to fetch.
     */
    where: ProsesWhereUniqueInput
  }

  /**
   * Proses findFirst
   */
  export type ProsesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter, which Proses to fetch.
     */
    where?: ProsesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proses to fetch.
     */
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Proses.
     */
    cursor?: ProsesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Proses.
     */
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Proses findFirstOrThrow
   */
  export type ProsesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter, which Proses to fetch.
     */
    where?: ProsesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proses to fetch.
     */
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Proses.
     */
    cursor?: ProsesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Proses.
     */
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Proses findMany
   */
  export type ProsesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter, which Proses to fetch.
     */
    where?: ProsesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Proses to fetch.
     */
    orderBy?: ProsesOrderByWithRelationInput | ProsesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Proses.
     */
    cursor?: ProsesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Proses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Proses.
     */
    skip?: number
    distinct?: ProsesScalarFieldEnum | ProsesScalarFieldEnum[]
  }

  /**
   * Proses create
   */
  export type ProsesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * The data needed to create a Proses.
     */
    data: XOR<ProsesCreateInput, ProsesUncheckedCreateInput>
  }

  /**
   * Proses createMany
   */
  export type ProsesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Proses.
     */
    data: ProsesCreateManyInput | ProsesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Proses update
   */
  export type ProsesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * The data needed to update a Proses.
     */
    data: XOR<ProsesUpdateInput, ProsesUncheckedUpdateInput>
    /**
     * Choose, which Proses to update.
     */
    where: ProsesWhereUniqueInput
  }

  /**
   * Proses updateMany
   */
  export type ProsesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Proses.
     */
    data: XOR<ProsesUpdateManyMutationInput, ProsesUncheckedUpdateManyInput>
    /**
     * Filter which Proses to update
     */
    where?: ProsesWhereInput
    /**
     * Limit how many Proses to update.
     */
    limit?: number
  }

  /**
   * Proses upsert
   */
  export type ProsesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * The filter to search for the Proses to update in case it exists.
     */
    where: ProsesWhereUniqueInput
    /**
     * In case the Proses found by the `where` argument doesn't exist, create a new Proses with this data.
     */
    create: XOR<ProsesCreateInput, ProsesUncheckedCreateInput>
    /**
     * In case the Proses was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProsesUpdateInput, ProsesUncheckedUpdateInput>
  }

  /**
   * Proses delete
   */
  export type ProsesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    /**
     * Filter which Proses to delete.
     */
    where: ProsesWhereUniqueInput
  }

  /**
   * Proses deleteMany
   */
  export type ProsesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Proses to delete
     */
    where?: ProsesWhereInput
    /**
     * Limit how many Proses to delete.
     */
    limit?: number
  }

  /**
   * Proses.machine
   */
  export type Proses$machineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Proses.outputItem
   */
  export type Proses$outputItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
  }

  /**
   * Proses.materials
   */
  export type Proses$materialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    where?: ProsesMaterialWhereInput
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    cursor?: ProsesMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProsesMaterialScalarFieldEnum | ProsesMaterialScalarFieldEnum[]
  }

  /**
   * Proses.productionReports
   */
  export type Proses$productionReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Proses.inventoryTxns
   */
  export type Proses$inventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    cursor?: InventoryTxnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * Proses without action
   */
  export type ProsesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
  }


  /**
   * Model ProsesMaterial
   */

  export type AggregateProsesMaterial = {
    _count: ProsesMaterialCountAggregateOutputType | null
    _avg: ProsesMaterialAvgAggregateOutputType | null
    _sum: ProsesMaterialSumAggregateOutputType | null
    _min: ProsesMaterialMinAggregateOutputType | null
    _max: ProsesMaterialMaxAggregateOutputType | null
  }

  export type ProsesMaterialAvgAggregateOutputType = {
    id: number | null
    prosesId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProsesMaterialSumAggregateOutputType = {
    id: number | null
    prosesId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProsesMaterialMinAggregateOutputType = {
    id: number | null
    prosesId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProsesMaterialMaxAggregateOutputType = {
    id: number | null
    prosesId: number | null
    materialId: number | null
    qtyReq: Decimal | null
  }

  export type ProsesMaterialCountAggregateOutputType = {
    id: number
    prosesId: number
    materialId: number
    qtyReq: number
    _all: number
  }


  export type ProsesMaterialAvgAggregateInputType = {
    id?: true
    prosesId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProsesMaterialSumAggregateInputType = {
    id?: true
    prosesId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProsesMaterialMinAggregateInputType = {
    id?: true
    prosesId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProsesMaterialMaxAggregateInputType = {
    id?: true
    prosesId?: true
    materialId?: true
    qtyReq?: true
  }

  export type ProsesMaterialCountAggregateInputType = {
    id?: true
    prosesId?: true
    materialId?: true
    qtyReq?: true
    _all?: true
  }

  export type ProsesMaterialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProsesMaterial to aggregate.
     */
    where?: ProsesMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProsesMaterials to fetch.
     */
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProsesMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProsesMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProsesMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProsesMaterials
    **/
    _count?: true | ProsesMaterialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProsesMaterialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProsesMaterialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProsesMaterialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProsesMaterialMaxAggregateInputType
  }

  export type GetProsesMaterialAggregateType<T extends ProsesMaterialAggregateArgs> = {
        [P in keyof T & keyof AggregateProsesMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProsesMaterial[P]>
      : GetScalarType<T[P], AggregateProsesMaterial[P]>
  }




  export type ProsesMaterialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProsesMaterialWhereInput
    orderBy?: ProsesMaterialOrderByWithAggregationInput | ProsesMaterialOrderByWithAggregationInput[]
    by: ProsesMaterialScalarFieldEnum[] | ProsesMaterialScalarFieldEnum
    having?: ProsesMaterialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProsesMaterialCountAggregateInputType | true
    _avg?: ProsesMaterialAvgAggregateInputType
    _sum?: ProsesMaterialSumAggregateInputType
    _min?: ProsesMaterialMinAggregateInputType
    _max?: ProsesMaterialMaxAggregateInputType
  }

  export type ProsesMaterialGroupByOutputType = {
    id: number
    prosesId: number
    materialId: number
    qtyReq: Decimal
    _count: ProsesMaterialCountAggregateOutputType | null
    _avg: ProsesMaterialAvgAggregateOutputType | null
    _sum: ProsesMaterialSumAggregateOutputType | null
    _min: ProsesMaterialMinAggregateOutputType | null
    _max: ProsesMaterialMaxAggregateOutputType | null
  }

  type GetProsesMaterialGroupByPayload<T extends ProsesMaterialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProsesMaterialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProsesMaterialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProsesMaterialGroupByOutputType[P]>
            : GetScalarType<T[P], ProsesMaterialGroupByOutputType[P]>
        }
      >
    >


  export type ProsesMaterialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prosesId?: boolean
    materialId?: boolean
    qtyReq?: boolean
    proses?: boolean | ProsesDefaultArgs<ExtArgs>
    material?: boolean | MaterialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prosesMaterial"]>



  export type ProsesMaterialSelectScalar = {
    id?: boolean
    prosesId?: boolean
    materialId?: boolean
    qtyReq?: boolean
  }

  export type ProsesMaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "prosesId" | "materialId" | "qtyReq", ExtArgs["result"]["prosesMaterial"]>
  export type ProsesMaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proses?: boolean | ProsesDefaultArgs<ExtArgs>
    material?: boolean | MaterialDefaultArgs<ExtArgs>
  }

  export type $ProsesMaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProsesMaterial"
    objects: {
      proses: Prisma.$ProsesPayload<ExtArgs>
      material: Prisma.$MaterialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      prosesId: number
      materialId: number
      qtyReq: Prisma.Decimal
    }, ExtArgs["result"]["prosesMaterial"]>
    composites: {}
  }

  type ProsesMaterialGetPayload<S extends boolean | null | undefined | ProsesMaterialDefaultArgs> = $Result.GetResult<Prisma.$ProsesMaterialPayload, S>

  type ProsesMaterialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProsesMaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProsesMaterialCountAggregateInputType | true
    }

  export interface ProsesMaterialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProsesMaterial'], meta: { name: 'ProsesMaterial' } }
    /**
     * Find zero or one ProsesMaterial that matches the filter.
     * @param {ProsesMaterialFindUniqueArgs} args - Arguments to find a ProsesMaterial
     * @example
     * // Get one ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProsesMaterialFindUniqueArgs>(args: SelectSubset<T, ProsesMaterialFindUniqueArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProsesMaterial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProsesMaterialFindUniqueOrThrowArgs} args - Arguments to find a ProsesMaterial
     * @example
     * // Get one ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProsesMaterialFindUniqueOrThrowArgs>(args: SelectSubset<T, ProsesMaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProsesMaterial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialFindFirstArgs} args - Arguments to find a ProsesMaterial
     * @example
     * // Get one ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProsesMaterialFindFirstArgs>(args?: SelectSubset<T, ProsesMaterialFindFirstArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProsesMaterial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialFindFirstOrThrowArgs} args - Arguments to find a ProsesMaterial
     * @example
     * // Get one ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProsesMaterialFindFirstOrThrowArgs>(args?: SelectSubset<T, ProsesMaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProsesMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProsesMaterials
     * const prosesMaterials = await prisma.prosesMaterial.findMany()
     * 
     * // Get first 10 ProsesMaterials
     * const prosesMaterials = await prisma.prosesMaterial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prosesMaterialWithIdOnly = await prisma.prosesMaterial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProsesMaterialFindManyArgs>(args?: SelectSubset<T, ProsesMaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProsesMaterial.
     * @param {ProsesMaterialCreateArgs} args - Arguments to create a ProsesMaterial.
     * @example
     * // Create one ProsesMaterial
     * const ProsesMaterial = await prisma.prosesMaterial.create({
     *   data: {
     *     // ... data to create a ProsesMaterial
     *   }
     * })
     * 
     */
    create<T extends ProsesMaterialCreateArgs>(args: SelectSubset<T, ProsesMaterialCreateArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProsesMaterials.
     * @param {ProsesMaterialCreateManyArgs} args - Arguments to create many ProsesMaterials.
     * @example
     * // Create many ProsesMaterials
     * const prosesMaterial = await prisma.prosesMaterial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProsesMaterialCreateManyArgs>(args?: SelectSubset<T, ProsesMaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProsesMaterial.
     * @param {ProsesMaterialDeleteArgs} args - Arguments to delete one ProsesMaterial.
     * @example
     * // Delete one ProsesMaterial
     * const ProsesMaterial = await prisma.prosesMaterial.delete({
     *   where: {
     *     // ... filter to delete one ProsesMaterial
     *   }
     * })
     * 
     */
    delete<T extends ProsesMaterialDeleteArgs>(args: SelectSubset<T, ProsesMaterialDeleteArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProsesMaterial.
     * @param {ProsesMaterialUpdateArgs} args - Arguments to update one ProsesMaterial.
     * @example
     * // Update one ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProsesMaterialUpdateArgs>(args: SelectSubset<T, ProsesMaterialUpdateArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProsesMaterials.
     * @param {ProsesMaterialDeleteManyArgs} args - Arguments to filter ProsesMaterials to delete.
     * @example
     * // Delete a few ProsesMaterials
     * const { count } = await prisma.prosesMaterial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProsesMaterialDeleteManyArgs>(args?: SelectSubset<T, ProsesMaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProsesMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProsesMaterials
     * const prosesMaterial = await prisma.prosesMaterial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProsesMaterialUpdateManyArgs>(args: SelectSubset<T, ProsesMaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProsesMaterial.
     * @param {ProsesMaterialUpsertArgs} args - Arguments to update or create a ProsesMaterial.
     * @example
     * // Update or create a ProsesMaterial
     * const prosesMaterial = await prisma.prosesMaterial.upsert({
     *   create: {
     *     // ... data to create a ProsesMaterial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProsesMaterial we want to update
     *   }
     * })
     */
    upsert<T extends ProsesMaterialUpsertArgs>(args: SelectSubset<T, ProsesMaterialUpsertArgs<ExtArgs>>): Prisma__ProsesMaterialClient<$Result.GetResult<Prisma.$ProsesMaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProsesMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialCountArgs} args - Arguments to filter ProsesMaterials to count.
     * @example
     * // Count the number of ProsesMaterials
     * const count = await prisma.prosesMaterial.count({
     *   where: {
     *     // ... the filter for the ProsesMaterials we want to count
     *   }
     * })
    **/
    count<T extends ProsesMaterialCountArgs>(
      args?: Subset<T, ProsesMaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProsesMaterialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProsesMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProsesMaterialAggregateArgs>(args: Subset<T, ProsesMaterialAggregateArgs>): Prisma.PrismaPromise<GetProsesMaterialAggregateType<T>>

    /**
     * Group by ProsesMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProsesMaterialGroupByArgs} args - Group by arguments.
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
      T extends ProsesMaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProsesMaterialGroupByArgs['orderBy'] }
        : { orderBy?: ProsesMaterialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProsesMaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProsesMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProsesMaterial model
   */
  readonly fields: ProsesMaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProsesMaterial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProsesMaterialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    proses<T extends ProsesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProsesDefaultArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProsesMaterial model
   */
  interface ProsesMaterialFieldRefs {
    readonly id: FieldRef<"ProsesMaterial", 'Int'>
    readonly prosesId: FieldRef<"ProsesMaterial", 'Int'>
    readonly materialId: FieldRef<"ProsesMaterial", 'Int'>
    readonly qtyReq: FieldRef<"ProsesMaterial", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ProsesMaterial findUnique
   */
  export type ProsesMaterialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProsesMaterial to fetch.
     */
    where: ProsesMaterialWhereUniqueInput
  }

  /**
   * ProsesMaterial findUniqueOrThrow
   */
  export type ProsesMaterialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProsesMaterial to fetch.
     */
    where: ProsesMaterialWhereUniqueInput
  }

  /**
   * ProsesMaterial findFirst
   */
  export type ProsesMaterialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProsesMaterial to fetch.
     */
    where?: ProsesMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProsesMaterials to fetch.
     */
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProsesMaterials.
     */
    cursor?: ProsesMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProsesMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProsesMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProsesMaterials.
     */
    distinct?: ProsesMaterialScalarFieldEnum | ProsesMaterialScalarFieldEnum[]
  }

  /**
   * ProsesMaterial findFirstOrThrow
   */
  export type ProsesMaterialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProsesMaterial to fetch.
     */
    where?: ProsesMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProsesMaterials to fetch.
     */
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProsesMaterials.
     */
    cursor?: ProsesMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProsesMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProsesMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProsesMaterials.
     */
    distinct?: ProsesMaterialScalarFieldEnum | ProsesMaterialScalarFieldEnum[]
  }

  /**
   * ProsesMaterial findMany
   */
  export type ProsesMaterialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter, which ProsesMaterials to fetch.
     */
    where?: ProsesMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProsesMaterials to fetch.
     */
    orderBy?: ProsesMaterialOrderByWithRelationInput | ProsesMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProsesMaterials.
     */
    cursor?: ProsesMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProsesMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProsesMaterials.
     */
    skip?: number
    distinct?: ProsesMaterialScalarFieldEnum | ProsesMaterialScalarFieldEnum[]
  }

  /**
   * ProsesMaterial create
   */
  export type ProsesMaterialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * The data needed to create a ProsesMaterial.
     */
    data: XOR<ProsesMaterialCreateInput, ProsesMaterialUncheckedCreateInput>
  }

  /**
   * ProsesMaterial createMany
   */
  export type ProsesMaterialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProsesMaterials.
     */
    data: ProsesMaterialCreateManyInput | ProsesMaterialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProsesMaterial update
   */
  export type ProsesMaterialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * The data needed to update a ProsesMaterial.
     */
    data: XOR<ProsesMaterialUpdateInput, ProsesMaterialUncheckedUpdateInput>
    /**
     * Choose, which ProsesMaterial to update.
     */
    where: ProsesMaterialWhereUniqueInput
  }

  /**
   * ProsesMaterial updateMany
   */
  export type ProsesMaterialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProsesMaterials.
     */
    data: XOR<ProsesMaterialUpdateManyMutationInput, ProsesMaterialUncheckedUpdateManyInput>
    /**
     * Filter which ProsesMaterials to update
     */
    where?: ProsesMaterialWhereInput
    /**
     * Limit how many ProsesMaterials to update.
     */
    limit?: number
  }

  /**
   * ProsesMaterial upsert
   */
  export type ProsesMaterialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * The filter to search for the ProsesMaterial to update in case it exists.
     */
    where: ProsesMaterialWhereUniqueInput
    /**
     * In case the ProsesMaterial found by the `where` argument doesn't exist, create a new ProsesMaterial with this data.
     */
    create: XOR<ProsesMaterialCreateInput, ProsesMaterialUncheckedCreateInput>
    /**
     * In case the ProsesMaterial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProsesMaterialUpdateInput, ProsesMaterialUncheckedUpdateInput>
  }

  /**
   * ProsesMaterial delete
   */
  export type ProsesMaterialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
    /**
     * Filter which ProsesMaterial to delete.
     */
    where: ProsesMaterialWhereUniqueInput
  }

  /**
   * ProsesMaterial deleteMany
   */
  export type ProsesMaterialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProsesMaterials to delete
     */
    where?: ProsesMaterialWhereInput
    /**
     * Limit how many ProsesMaterials to delete.
     */
    limit?: number
  }

  /**
   * ProsesMaterial without action
   */
  export type ProsesMaterialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProsesMaterial
     */
    select?: ProsesMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProsesMaterial
     */
    omit?: ProsesMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesMaterialInclude<ExtArgs> | null
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
    prosesId: number | null
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
    qtyReject: Decimal | null
    totalDowntime: number | null
    inputWipQty: Decimal | null
  }

  export type ProductionReportSumAggregateOutputType = {
    prosesId: number | null
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
    qtyReject: Decimal | null
    totalDowntime: number | null
    inputWipQty: Decimal | null
  }

  export type ProductionReportMinAggregateOutputType = {
    id: string | null
    prosesId: number | null
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
    qtyReject: Decimal | null
    totalDowntime: number | null
    notes: string | null
    othersNote: string | null
    adminNote: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.ReportStatus | null
    rejectionNote: string | null
    checkedById: string | null
    checkedAt: Date | null
    voidedAt: Date | null
    voidedById: string | null
    voidReason: string | null
    stockPostedAt: Date | null
    inputWipQty: Decimal | null
  }

  export type ProductionReportMaxAggregateOutputType = {
    id: string | null
    prosesId: number | null
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
    qtyReject: Decimal | null
    totalDowntime: number | null
    notes: string | null
    othersNote: string | null
    adminNote: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.ReportStatus | null
    rejectionNote: string | null
    checkedById: string | null
    checkedAt: Date | null
    voidedAt: Date | null
    voidedById: string | null
    voidReason: string | null
    stockPostedAt: Date | null
    inputWipQty: Decimal | null
  }

  export type ProductionReportCountAggregateOutputType = {
    id: number
    prosesId: number
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
    qtyReject: number
    rejectBreakdown: number
    downtimeBreakdown: number
    totalDowntime: number
    notes: number
    othersNote: number
    adminNote: number
    metaData: number
    createdById: number
    createdAt: number
    updatedAt: number
    status: number
    rejectionNote: number
    checkedById: number
    checkedAt: number
    voidedAt: number
    voidedById: number
    voidReason: number
    stockPostedAt: number
    inputWipQty: number
    _all: number
  }


  export type ProductionReportAvgAggregateInputType = {
    prosesId?: true
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
    qtyReject?: true
    totalDowntime?: true
    inputWipQty?: true
  }

  export type ProductionReportSumAggregateInputType = {
    prosesId?: true
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
    qtyReject?: true
    totalDowntime?: true
    inputWipQty?: true
  }

  export type ProductionReportMinAggregateInputType = {
    id?: true
    prosesId?: true
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
    qtyReject?: true
    totalDowntime?: true
    notes?: true
    othersNote?: true
    adminNote?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    rejectionNote?: true
    checkedById?: true
    checkedAt?: true
    voidedAt?: true
    voidedById?: true
    voidReason?: true
    stockPostedAt?: true
    inputWipQty?: true
  }

  export type ProductionReportMaxAggregateInputType = {
    id?: true
    prosesId?: true
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
    qtyReject?: true
    totalDowntime?: true
    notes?: true
    othersNote?: true
    adminNote?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    rejectionNote?: true
    checkedById?: true
    checkedAt?: true
    voidedAt?: true
    voidedById?: true
    voidReason?: true
    stockPostedAt?: true
    inputWipQty?: true
  }

  export type ProductionReportCountAggregateInputType = {
    id?: true
    prosesId?: true
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
    qtyReject?: true
    rejectBreakdown?: true
    downtimeBreakdown?: true
    totalDowntime?: true
    notes?: true
    othersNote?: true
    adminNote?: true
    metaData?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    rejectionNote?: true
    checkedById?: true
    checkedAt?: true
    voidedAt?: true
    voidedById?: true
    voidReason?: true
    stockPostedAt?: true
    inputWipQty?: true
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
    prosesId: number
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
    qtyReject: Decimal
    rejectBreakdown: JsonValue | null
    downtimeBreakdown: JsonValue | null
    totalDowntime: number
    notes: string | null
    othersNote: string | null
    adminNote: string | null
    metaData: JsonValue | null
    createdById: string | null
    createdAt: Date
    updatedAt: Date
    status: $Enums.ReportStatus
    rejectionNote: string | null
    checkedById: string | null
    checkedAt: Date | null
    voidedAt: Date | null
    voidedById: string | null
    voidReason: string | null
    stockPostedAt: Date | null
    inputWipQty: Decimal | null
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
    prosesId?: boolean
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
    qtyReject?: boolean
    rejectBreakdown?: boolean
    downtimeBreakdown?: boolean
    totalDowntime?: boolean
    notes?: boolean
    othersNote?: boolean
    adminNote?: boolean
    metaData?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    rejectionNote?: boolean
    checkedById?: boolean
    checkedAt?: boolean
    voidedAt?: boolean
    voidedById?: boolean
    voidReason?: boolean
    stockPostedAt?: boolean
    inputWipQty?: boolean
    proses?: boolean | ProsesDefaultArgs<ExtArgs>
    createdBy?: boolean | ProductionReport$createdByArgs<ExtArgs>
    checkedBy?: boolean | ProductionReport$checkedByArgs<ExtArgs>
    inventoryTxns?: boolean | ProductionReport$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProductionReportCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productionReport"]>



  export type ProductionReportSelectScalar = {
    id?: boolean
    prosesId?: boolean
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
    qtyReject?: boolean
    rejectBreakdown?: boolean
    downtimeBreakdown?: boolean
    totalDowntime?: boolean
    notes?: boolean
    othersNote?: boolean
    adminNote?: boolean
    metaData?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    rejectionNote?: boolean
    checkedById?: boolean
    checkedAt?: boolean
    voidedAt?: boolean
    voidedById?: boolean
    voidReason?: boolean
    stockPostedAt?: boolean
    inputWipQty?: boolean
  }

  export type ProductionReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "prosesId" | "reportDate" | "shift" | "operatorName" | "reportType" | "startTime" | "endTime" | "batchNo" | "manPowerStd" | "manPowerAct" | "cycleTimeStd" | "cycleTimeAct" | "cavityStd" | "cavityAct" | "inputMaterialQty" | "materialRunnerQty" | "materialPurgeQty" | "qtyPassOn" | "qtyHold" | "qtyWip" | "qtyReject" | "rejectBreakdown" | "downtimeBreakdown" | "totalDowntime" | "notes" | "othersNote" | "adminNote" | "metaData" | "createdById" | "createdAt" | "updatedAt" | "status" | "rejectionNote" | "checkedById" | "checkedAt" | "voidedAt" | "voidedById" | "voidReason" | "stockPostedAt" | "inputWipQty", ExtArgs["result"]["productionReport"]>
  export type ProductionReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    proses?: boolean | ProsesDefaultArgs<ExtArgs>
    createdBy?: boolean | ProductionReport$createdByArgs<ExtArgs>
    checkedBy?: boolean | ProductionReport$checkedByArgs<ExtArgs>
    inventoryTxns?: boolean | ProductionReport$inventoryTxnsArgs<ExtArgs>
    _count?: boolean | ProductionReportCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductionReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductionReport"
    objects: {
      proses: Prisma.$ProsesPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs> | null
      checkedBy: Prisma.$UserPayload<ExtArgs> | null
      inventoryTxns: Prisma.$InventoryTxnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prosesId: number
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
      qtyReject: Prisma.Decimal
      rejectBreakdown: Prisma.JsonValue | null
      downtimeBreakdown: Prisma.JsonValue | null
      totalDowntime: number
      notes: string | null
      othersNote: string | null
      adminNote: string | null
      metaData: Prisma.JsonValue | null
      createdById: string | null
      createdAt: Date
      updatedAt: Date
      status: $Enums.ReportStatus
      rejectionNote: string | null
      checkedById: string | null
      checkedAt: Date | null
      voidedAt: Date | null
      voidedById: string | null
      voidReason: string | null
      stockPostedAt: Date | null
      inputWipQty: Prisma.Decimal | null
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
    proses<T extends ProsesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProsesDefaultArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends ProductionReport$createdByArgs<ExtArgs> = {}>(args?: Subset<T, ProductionReport$createdByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    checkedBy<T extends ProductionReport$checkedByArgs<ExtArgs> = {}>(args?: Subset<T, ProductionReport$checkedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    inventoryTxns<T extends ProductionReport$inventoryTxnsArgs<ExtArgs> = {}>(args?: Subset<T, ProductionReport$inventoryTxnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly prosesId: FieldRef<"ProductionReport", 'Int'>
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
    readonly qtyReject: FieldRef<"ProductionReport", 'Decimal'>
    readonly rejectBreakdown: FieldRef<"ProductionReport", 'Json'>
    readonly downtimeBreakdown: FieldRef<"ProductionReport", 'Json'>
    readonly totalDowntime: FieldRef<"ProductionReport", 'Int'>
    readonly notes: FieldRef<"ProductionReport", 'String'>
    readonly othersNote: FieldRef<"ProductionReport", 'String'>
    readonly adminNote: FieldRef<"ProductionReport", 'String'>
    readonly metaData: FieldRef<"ProductionReport", 'Json'>
    readonly createdById: FieldRef<"ProductionReport", 'String'>
    readonly createdAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly status: FieldRef<"ProductionReport", 'ReportStatus'>
    readonly rejectionNote: FieldRef<"ProductionReport", 'String'>
    readonly checkedById: FieldRef<"ProductionReport", 'String'>
    readonly checkedAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly voidedAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly voidedById: FieldRef<"ProductionReport", 'String'>
    readonly voidReason: FieldRef<"ProductionReport", 'String'>
    readonly stockPostedAt: FieldRef<"ProductionReport", 'DateTime'>
    readonly inputWipQty: FieldRef<"ProductionReport", 'Decimal'>
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
   * ProductionReport.createdBy
   */
  export type ProductionReport$createdByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ProductionReport.checkedBy
   */
  export type ProductionReport$checkedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ProductionReport.inventoryTxns
   */
  export type ProductionReport$inventoryTxnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    cursor?: InventoryTxnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
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
   * Model InventoryLocation
   */

  export type AggregateInventoryLocation = {
    _count: InventoryLocationCountAggregateOutputType | null
    _avg: InventoryLocationAvgAggregateOutputType | null
    _sum: InventoryLocationSumAggregateOutputType | null
    _min: InventoryLocationMinAggregateOutputType | null
    _max: InventoryLocationMaxAggregateOutputType | null
  }

  export type InventoryLocationAvgAggregateOutputType = {
    id: number | null
    machineId: number | null
  }

  export type InventoryLocationSumAggregateOutputType = {
    id: number | null
    machineId: number | null
  }

  export type InventoryLocationMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.LocationType | null
    machineId: number | null
  }

  export type InventoryLocationMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    type: $Enums.LocationType | null
    machineId: number | null
  }

  export type InventoryLocationCountAggregateOutputType = {
    id: number
    code: number
    name: number
    type: number
    machineId: number
    _all: number
  }


  export type InventoryLocationAvgAggregateInputType = {
    id?: true
    machineId?: true
  }

  export type InventoryLocationSumAggregateInputType = {
    id?: true
    machineId?: true
  }

  export type InventoryLocationMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
    machineId?: true
  }

  export type InventoryLocationMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
    machineId?: true
  }

  export type InventoryLocationCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    type?: true
    machineId?: true
    _all?: true
  }

  export type InventoryLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLocation to aggregate.
     */
    where?: InventoryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocations to fetch.
     */
    orderBy?: InventoryLocationOrderByWithRelationInput | InventoryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryLocations
    **/
    _count?: true | InventoryLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryLocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryLocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryLocationMaxAggregateInputType
  }

  export type GetInventoryLocationAggregateType<T extends InventoryLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryLocation[P]>
      : GetScalarType<T[P], AggregateInventoryLocation[P]>
  }




  export type InventoryLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLocationWhereInput
    orderBy?: InventoryLocationOrderByWithAggregationInput | InventoryLocationOrderByWithAggregationInput[]
    by: InventoryLocationScalarFieldEnum[] | InventoryLocationScalarFieldEnum
    having?: InventoryLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryLocationCountAggregateInputType | true
    _avg?: InventoryLocationAvgAggregateInputType
    _sum?: InventoryLocationSumAggregateInputType
    _min?: InventoryLocationMinAggregateInputType
    _max?: InventoryLocationMaxAggregateInputType
  }

  export type InventoryLocationGroupByOutputType = {
    id: number
    code: string
    name: string
    type: $Enums.LocationType
    machineId: number | null
    _count: InventoryLocationCountAggregateOutputType | null
    _avg: InventoryLocationAvgAggregateOutputType | null
    _sum: InventoryLocationSumAggregateOutputType | null
    _min: InventoryLocationMinAggregateOutputType | null
    _max: InventoryLocationMaxAggregateOutputType | null
  }

  type GetInventoryLocationGroupByPayload<T extends InventoryLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryLocationGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryLocationGroupByOutputType[P]>
        }
      >
    >


  export type InventoryLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    machineId?: boolean
    machine?: boolean | InventoryLocation$machineArgs<ExtArgs>
    txns?: boolean | InventoryLocation$txnsArgs<ExtArgs>
    _count?: boolean | InventoryLocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryLocation"]>



  export type InventoryLocationSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    type?: boolean
    machineId?: boolean
  }

  export type InventoryLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "type" | "machineId", ExtArgs["result"]["inventoryLocation"]>
  export type InventoryLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    machine?: boolean | InventoryLocation$machineArgs<ExtArgs>
    txns?: boolean | InventoryLocation$txnsArgs<ExtArgs>
    _count?: boolean | InventoryLocationCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InventoryLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryLocation"
    objects: {
      machine: Prisma.$MachinePayload<ExtArgs> | null
      txns: Prisma.$InventoryTxnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      type: $Enums.LocationType
      machineId: number | null
    }, ExtArgs["result"]["inventoryLocation"]>
    composites: {}
  }

  type InventoryLocationGetPayload<S extends boolean | null | undefined | InventoryLocationDefaultArgs> = $Result.GetResult<Prisma.$InventoryLocationPayload, S>

  type InventoryLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryLocationCountAggregateInputType | true
    }

  export interface InventoryLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryLocation'], meta: { name: 'InventoryLocation' } }
    /**
     * Find zero or one InventoryLocation that matches the filter.
     * @param {InventoryLocationFindUniqueArgs} args - Arguments to find a InventoryLocation
     * @example
     * // Get one InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryLocationFindUniqueArgs>(args: SelectSubset<T, InventoryLocationFindUniqueArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryLocationFindUniqueOrThrowArgs} args - Arguments to find a InventoryLocation
     * @example
     * // Get one InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationFindFirstArgs} args - Arguments to find a InventoryLocation
     * @example
     * // Get one InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryLocationFindFirstArgs>(args?: SelectSubset<T, InventoryLocationFindFirstArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationFindFirstOrThrowArgs} args - Arguments to find a InventoryLocation
     * @example
     * // Get one InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryLocations
     * const inventoryLocations = await prisma.inventoryLocation.findMany()
     * 
     * // Get first 10 InventoryLocations
     * const inventoryLocations = await prisma.inventoryLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryLocationWithIdOnly = await prisma.inventoryLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryLocationFindManyArgs>(args?: SelectSubset<T, InventoryLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryLocation.
     * @param {InventoryLocationCreateArgs} args - Arguments to create a InventoryLocation.
     * @example
     * // Create one InventoryLocation
     * const InventoryLocation = await prisma.inventoryLocation.create({
     *   data: {
     *     // ... data to create a InventoryLocation
     *   }
     * })
     * 
     */
    create<T extends InventoryLocationCreateArgs>(args: SelectSubset<T, InventoryLocationCreateArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryLocations.
     * @param {InventoryLocationCreateManyArgs} args - Arguments to create many InventoryLocations.
     * @example
     * // Create many InventoryLocations
     * const inventoryLocation = await prisma.inventoryLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryLocationCreateManyArgs>(args?: SelectSubset<T, InventoryLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InventoryLocation.
     * @param {InventoryLocationDeleteArgs} args - Arguments to delete one InventoryLocation.
     * @example
     * // Delete one InventoryLocation
     * const InventoryLocation = await prisma.inventoryLocation.delete({
     *   where: {
     *     // ... filter to delete one InventoryLocation
     *   }
     * })
     * 
     */
    delete<T extends InventoryLocationDeleteArgs>(args: SelectSubset<T, InventoryLocationDeleteArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryLocation.
     * @param {InventoryLocationUpdateArgs} args - Arguments to update one InventoryLocation.
     * @example
     * // Update one InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryLocationUpdateArgs>(args: SelectSubset<T, InventoryLocationUpdateArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryLocations.
     * @param {InventoryLocationDeleteManyArgs} args - Arguments to filter InventoryLocations to delete.
     * @example
     * // Delete a few InventoryLocations
     * const { count } = await prisma.inventoryLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryLocationDeleteManyArgs>(args?: SelectSubset<T, InventoryLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryLocations
     * const inventoryLocation = await prisma.inventoryLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryLocationUpdateManyArgs>(args: SelectSubset<T, InventoryLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryLocation.
     * @param {InventoryLocationUpsertArgs} args - Arguments to update or create a InventoryLocation.
     * @example
     * // Update or create a InventoryLocation
     * const inventoryLocation = await prisma.inventoryLocation.upsert({
     *   create: {
     *     // ... data to create a InventoryLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryLocation we want to update
     *   }
     * })
     */
    upsert<T extends InventoryLocationUpsertArgs>(args: SelectSubset<T, InventoryLocationUpsertArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationCountArgs} args - Arguments to filter InventoryLocations to count.
     * @example
     * // Count the number of InventoryLocations
     * const count = await prisma.inventoryLocation.count({
     *   where: {
     *     // ... the filter for the InventoryLocations we want to count
     *   }
     * })
    **/
    count<T extends InventoryLocationCountArgs>(
      args?: Subset<T, InventoryLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryLocationAggregateArgs>(args: Subset<T, InventoryLocationAggregateArgs>): Prisma.PrismaPromise<GetInventoryLocationAggregateType<T>>

    /**
     * Group by InventoryLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLocationGroupByArgs} args - Group by arguments.
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
      T extends InventoryLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryLocationGroupByArgs['orderBy'] }
        : { orderBy?: InventoryLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryLocation model
   */
  readonly fields: InventoryLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    machine<T extends InventoryLocation$machineArgs<ExtArgs> = {}>(args?: Subset<T, InventoryLocation$machineArgs<ExtArgs>>): Prisma__MachineClient<$Result.GetResult<Prisma.$MachinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    txns<T extends InventoryLocation$txnsArgs<ExtArgs> = {}>(args?: Subset<T, InventoryLocation$txnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the InventoryLocation model
   */
  interface InventoryLocationFieldRefs {
    readonly id: FieldRef<"InventoryLocation", 'Int'>
    readonly code: FieldRef<"InventoryLocation", 'String'>
    readonly name: FieldRef<"InventoryLocation", 'String'>
    readonly type: FieldRef<"InventoryLocation", 'LocationType'>
    readonly machineId: FieldRef<"InventoryLocation", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * InventoryLocation findUnique
   */
  export type InventoryLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLocation to fetch.
     */
    where: InventoryLocationWhereUniqueInput
  }

  /**
   * InventoryLocation findUniqueOrThrow
   */
  export type InventoryLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLocation to fetch.
     */
    where: InventoryLocationWhereUniqueInput
  }

  /**
   * InventoryLocation findFirst
   */
  export type InventoryLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLocation to fetch.
     */
    where?: InventoryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocations to fetch.
     */
    orderBy?: InventoryLocationOrderByWithRelationInput | InventoryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLocations.
     */
    cursor?: InventoryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLocations.
     */
    distinct?: InventoryLocationScalarFieldEnum | InventoryLocationScalarFieldEnum[]
  }

  /**
   * InventoryLocation findFirstOrThrow
   */
  export type InventoryLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLocation to fetch.
     */
    where?: InventoryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocations to fetch.
     */
    orderBy?: InventoryLocationOrderByWithRelationInput | InventoryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLocations.
     */
    cursor?: InventoryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLocations.
     */
    distinct?: InventoryLocationScalarFieldEnum | InventoryLocationScalarFieldEnum[]
  }

  /**
   * InventoryLocation findMany
   */
  export type InventoryLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryLocations to fetch.
     */
    where?: InventoryLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocations to fetch.
     */
    orderBy?: InventoryLocationOrderByWithRelationInput | InventoryLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryLocations.
     */
    cursor?: InventoryLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocations.
     */
    skip?: number
    distinct?: InventoryLocationScalarFieldEnum | InventoryLocationScalarFieldEnum[]
  }

  /**
   * InventoryLocation create
   */
  export type InventoryLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryLocation.
     */
    data: XOR<InventoryLocationCreateInput, InventoryLocationUncheckedCreateInput>
  }

  /**
   * InventoryLocation createMany
   */
  export type InventoryLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryLocations.
     */
    data: InventoryLocationCreateManyInput | InventoryLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryLocation update
   */
  export type InventoryLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryLocation.
     */
    data: XOR<InventoryLocationUpdateInput, InventoryLocationUncheckedUpdateInput>
    /**
     * Choose, which InventoryLocation to update.
     */
    where: InventoryLocationWhereUniqueInput
  }

  /**
   * InventoryLocation updateMany
   */
  export type InventoryLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryLocations.
     */
    data: XOR<InventoryLocationUpdateManyMutationInput, InventoryLocationUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLocations to update
     */
    where?: InventoryLocationWhereInput
    /**
     * Limit how many InventoryLocations to update.
     */
    limit?: number
  }

  /**
   * InventoryLocation upsert
   */
  export type InventoryLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryLocation to update in case it exists.
     */
    where: InventoryLocationWhereUniqueInput
    /**
     * In case the InventoryLocation found by the `where` argument doesn't exist, create a new InventoryLocation with this data.
     */
    create: XOR<InventoryLocationCreateInput, InventoryLocationUncheckedCreateInput>
    /**
     * In case the InventoryLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryLocationUpdateInput, InventoryLocationUncheckedUpdateInput>
  }

  /**
   * InventoryLocation delete
   */
  export type InventoryLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
    /**
     * Filter which InventoryLocation to delete.
     */
    where: InventoryLocationWhereUniqueInput
  }

  /**
   * InventoryLocation deleteMany
   */
  export type InventoryLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLocations to delete
     */
    where?: InventoryLocationWhereInput
    /**
     * Limit how many InventoryLocations to delete.
     */
    limit?: number
  }

  /**
   * InventoryLocation.machine
   */
  export type InventoryLocation$machineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * InventoryLocation.txns
   */
  export type InventoryLocation$txnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    cursor?: InventoryTxnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * InventoryLocation without action
   */
  export type InventoryLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLocation
     */
    select?: InventoryLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryLocation
     */
    omit?: InventoryLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryLocationInclude<ExtArgs> | null
  }


  /**
   * Model InventoryTxn
   */

  export type AggregateInventoryTxn = {
    _count: InventoryTxnCountAggregateOutputType | null
    _avg: InventoryTxnAvgAggregateOutputType | null
    _sum: InventoryTxnSumAggregateOutputType | null
    _min: InventoryTxnMinAggregateOutputType | null
    _max: InventoryTxnMaxAggregateOutputType | null
  }

  export type InventoryTxnAvgAggregateOutputType = {
    qty: Decimal | null
    itemMasterId: number | null
    locationId: number | null
    proId: number | null
    prosesId: number | null
  }

  export type InventoryTxnSumAggregateOutputType = {
    qty: Decimal | null
    itemMasterId: number | null
    locationId: number | null
    proId: number | null
    prosesId: number | null
  }

  export type InventoryTxnMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    date: Date | null
    type: $Enums.TxnType | null
    itemId: string | null
    qty: Decimal | null
    itemMasterId: number | null
    locationId: number | null
    proId: number | null
    prosesId: number | null
    productionReportId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type InventoryTxnMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    date: Date | null
    type: $Enums.TxnType | null
    itemId: string | null
    qty: Decimal | null
    itemMasterId: number | null
    locationId: number | null
    proId: number | null
    prosesId: number | null
    productionReportId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type InventoryTxnCountAggregateOutputType = {
    id: number
    groupId: number
    date: number
    type: number
    itemId: number
    qty: number
    itemMasterId: number
    locationId: number
    proId: number
    prosesId: number
    productionReportId: number
    notes: number
    createdAt: number
    _all: number
  }


  export type InventoryTxnAvgAggregateInputType = {
    qty?: true
    itemMasterId?: true
    locationId?: true
    proId?: true
    prosesId?: true
  }

  export type InventoryTxnSumAggregateInputType = {
    qty?: true
    itemMasterId?: true
    locationId?: true
    proId?: true
    prosesId?: true
  }

  export type InventoryTxnMinAggregateInputType = {
    id?: true
    groupId?: true
    date?: true
    type?: true
    itemId?: true
    qty?: true
    itemMasterId?: true
    locationId?: true
    proId?: true
    prosesId?: true
    productionReportId?: true
    notes?: true
    createdAt?: true
  }

  export type InventoryTxnMaxAggregateInputType = {
    id?: true
    groupId?: true
    date?: true
    type?: true
    itemId?: true
    qty?: true
    itemMasterId?: true
    locationId?: true
    proId?: true
    prosesId?: true
    productionReportId?: true
    notes?: true
    createdAt?: true
  }

  export type InventoryTxnCountAggregateInputType = {
    id?: true
    groupId?: true
    date?: true
    type?: true
    itemId?: true
    qty?: true
    itemMasterId?: true
    locationId?: true
    proId?: true
    prosesId?: true
    productionReportId?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryTxnAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryTxn to aggregate.
     */
    where?: InventoryTxnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryTxns to fetch.
     */
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryTxnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryTxns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryTxns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryTxns
    **/
    _count?: true | InventoryTxnCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryTxnAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryTxnSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryTxnMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryTxnMaxAggregateInputType
  }

  export type GetInventoryTxnAggregateType<T extends InventoryTxnAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryTxn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryTxn[P]>
      : GetScalarType<T[P], AggregateInventoryTxn[P]>
  }




  export type InventoryTxnGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryTxnWhereInput
    orderBy?: InventoryTxnOrderByWithAggregationInput | InventoryTxnOrderByWithAggregationInput[]
    by: InventoryTxnScalarFieldEnum[] | InventoryTxnScalarFieldEnum
    having?: InventoryTxnScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryTxnCountAggregateInputType | true
    _avg?: InventoryTxnAvgAggregateInputType
    _sum?: InventoryTxnSumAggregateInputType
    _min?: InventoryTxnMinAggregateInputType
    _max?: InventoryTxnMaxAggregateInputType
  }

  export type InventoryTxnGroupByOutputType = {
    id: string
    groupId: string
    date: Date
    type: $Enums.TxnType
    itemId: string
    qty: Decimal
    itemMasterId: number | null
    locationId: number
    proId: number | null
    prosesId: number | null
    productionReportId: string | null
    notes: string | null
    createdAt: Date
    _count: InventoryTxnCountAggregateOutputType | null
    _avg: InventoryTxnAvgAggregateOutputType | null
    _sum: InventoryTxnSumAggregateOutputType | null
    _min: InventoryTxnMinAggregateOutputType | null
    _max: InventoryTxnMaxAggregateOutputType | null
  }

  type GetInventoryTxnGroupByPayload<T extends InventoryTxnGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryTxnGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryTxnGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryTxnGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryTxnGroupByOutputType[P]>
        }
      >
    >


  export type InventoryTxnSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    date?: boolean
    type?: boolean
    itemId?: boolean
    qty?: boolean
    itemMasterId?: boolean
    locationId?: boolean
    proId?: boolean
    prosesId?: boolean
    productionReportId?: boolean
    notes?: boolean
    createdAt?: boolean
    itemMaster?: boolean | InventoryTxn$itemMasterArgs<ExtArgs>
    location?: boolean | InventoryLocationDefaultArgs<ExtArgs>
    pro?: boolean | InventoryTxn$proArgs<ExtArgs>
    proses?: boolean | InventoryTxn$prosesArgs<ExtArgs>
    productionReport?: boolean | InventoryTxn$productionReportArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryTxn"]>



  export type InventoryTxnSelectScalar = {
    id?: boolean
    groupId?: boolean
    date?: boolean
    type?: boolean
    itemId?: boolean
    qty?: boolean
    itemMasterId?: boolean
    locationId?: boolean
    proId?: boolean
    prosesId?: boolean
    productionReportId?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type InventoryTxnOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "date" | "type" | "itemId" | "qty" | "itemMasterId" | "locationId" | "proId" | "prosesId" | "productionReportId" | "notes" | "createdAt", ExtArgs["result"]["inventoryTxn"]>
  export type InventoryTxnInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itemMaster?: boolean | InventoryTxn$itemMasterArgs<ExtArgs>
    location?: boolean | InventoryLocationDefaultArgs<ExtArgs>
    pro?: boolean | InventoryTxn$proArgs<ExtArgs>
    proses?: boolean | InventoryTxn$prosesArgs<ExtArgs>
    productionReport?: boolean | InventoryTxn$productionReportArgs<ExtArgs>
  }

  export type $InventoryTxnPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryTxn"
    objects: {
      itemMaster: Prisma.$ItemPayload<ExtArgs> | null
      location: Prisma.$InventoryLocationPayload<ExtArgs>
      pro: Prisma.$ProPayload<ExtArgs> | null
      proses: Prisma.$ProsesPayload<ExtArgs> | null
      productionReport: Prisma.$ProductionReportPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      date: Date
      type: $Enums.TxnType
      itemId: string
      qty: Prisma.Decimal
      itemMasterId: number | null
      locationId: number
      proId: number | null
      prosesId: number | null
      productionReportId: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["inventoryTxn"]>
    composites: {}
  }

  type InventoryTxnGetPayload<S extends boolean | null | undefined | InventoryTxnDefaultArgs> = $Result.GetResult<Prisma.$InventoryTxnPayload, S>

  type InventoryTxnCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryTxnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryTxnCountAggregateInputType | true
    }

  export interface InventoryTxnDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryTxn'], meta: { name: 'InventoryTxn' } }
    /**
     * Find zero or one InventoryTxn that matches the filter.
     * @param {InventoryTxnFindUniqueArgs} args - Arguments to find a InventoryTxn
     * @example
     * // Get one InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryTxnFindUniqueArgs>(args: SelectSubset<T, InventoryTxnFindUniqueArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryTxn that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryTxnFindUniqueOrThrowArgs} args - Arguments to find a InventoryTxn
     * @example
     * // Get one InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryTxnFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryTxnFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryTxn that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnFindFirstArgs} args - Arguments to find a InventoryTxn
     * @example
     * // Get one InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryTxnFindFirstArgs>(args?: SelectSubset<T, InventoryTxnFindFirstArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryTxn that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnFindFirstOrThrowArgs} args - Arguments to find a InventoryTxn
     * @example
     * // Get one InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryTxnFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryTxnFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryTxns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryTxns
     * const inventoryTxns = await prisma.inventoryTxn.findMany()
     * 
     * // Get first 10 InventoryTxns
     * const inventoryTxns = await prisma.inventoryTxn.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryTxnWithIdOnly = await prisma.inventoryTxn.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryTxnFindManyArgs>(args?: SelectSubset<T, InventoryTxnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryTxn.
     * @param {InventoryTxnCreateArgs} args - Arguments to create a InventoryTxn.
     * @example
     * // Create one InventoryTxn
     * const InventoryTxn = await prisma.inventoryTxn.create({
     *   data: {
     *     // ... data to create a InventoryTxn
     *   }
     * })
     * 
     */
    create<T extends InventoryTxnCreateArgs>(args: SelectSubset<T, InventoryTxnCreateArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryTxns.
     * @param {InventoryTxnCreateManyArgs} args - Arguments to create many InventoryTxns.
     * @example
     * // Create many InventoryTxns
     * const inventoryTxn = await prisma.inventoryTxn.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryTxnCreateManyArgs>(args?: SelectSubset<T, InventoryTxnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InventoryTxn.
     * @param {InventoryTxnDeleteArgs} args - Arguments to delete one InventoryTxn.
     * @example
     * // Delete one InventoryTxn
     * const InventoryTxn = await prisma.inventoryTxn.delete({
     *   where: {
     *     // ... filter to delete one InventoryTxn
     *   }
     * })
     * 
     */
    delete<T extends InventoryTxnDeleteArgs>(args: SelectSubset<T, InventoryTxnDeleteArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryTxn.
     * @param {InventoryTxnUpdateArgs} args - Arguments to update one InventoryTxn.
     * @example
     * // Update one InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryTxnUpdateArgs>(args: SelectSubset<T, InventoryTxnUpdateArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryTxns.
     * @param {InventoryTxnDeleteManyArgs} args - Arguments to filter InventoryTxns to delete.
     * @example
     * // Delete a few InventoryTxns
     * const { count } = await prisma.inventoryTxn.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryTxnDeleteManyArgs>(args?: SelectSubset<T, InventoryTxnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryTxns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryTxns
     * const inventoryTxn = await prisma.inventoryTxn.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryTxnUpdateManyArgs>(args: SelectSubset<T, InventoryTxnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryTxn.
     * @param {InventoryTxnUpsertArgs} args - Arguments to update or create a InventoryTxn.
     * @example
     * // Update or create a InventoryTxn
     * const inventoryTxn = await prisma.inventoryTxn.upsert({
     *   create: {
     *     // ... data to create a InventoryTxn
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryTxn we want to update
     *   }
     * })
     */
    upsert<T extends InventoryTxnUpsertArgs>(args: SelectSubset<T, InventoryTxnUpsertArgs<ExtArgs>>): Prisma__InventoryTxnClient<$Result.GetResult<Prisma.$InventoryTxnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryTxns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnCountArgs} args - Arguments to filter InventoryTxns to count.
     * @example
     * // Count the number of InventoryTxns
     * const count = await prisma.inventoryTxn.count({
     *   where: {
     *     // ... the filter for the InventoryTxns we want to count
     *   }
     * })
    **/
    count<T extends InventoryTxnCountArgs>(
      args?: Subset<T, InventoryTxnCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryTxnCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryTxn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryTxnAggregateArgs>(args: Subset<T, InventoryTxnAggregateArgs>): Prisma.PrismaPromise<GetInventoryTxnAggregateType<T>>

    /**
     * Group by InventoryTxn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryTxnGroupByArgs} args - Group by arguments.
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
      T extends InventoryTxnGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryTxnGroupByArgs['orderBy'] }
        : { orderBy?: InventoryTxnGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryTxnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryTxnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryTxn model
   */
  readonly fields: InventoryTxnFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryTxn.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryTxnClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    itemMaster<T extends InventoryTxn$itemMasterArgs<ExtArgs> = {}>(args?: Subset<T, InventoryTxn$itemMasterArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    location<T extends InventoryLocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryLocationDefaultArgs<ExtArgs>>): Prisma__InventoryLocationClient<$Result.GetResult<Prisma.$InventoryLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pro<T extends InventoryTxn$proArgs<ExtArgs> = {}>(args?: Subset<T, InventoryTxn$proArgs<ExtArgs>>): Prisma__ProClient<$Result.GetResult<Prisma.$ProPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    proses<T extends InventoryTxn$prosesArgs<ExtArgs> = {}>(args?: Subset<T, InventoryTxn$prosesArgs<ExtArgs>>): Prisma__ProsesClient<$Result.GetResult<Prisma.$ProsesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    productionReport<T extends InventoryTxn$productionReportArgs<ExtArgs> = {}>(args?: Subset<T, InventoryTxn$productionReportArgs<ExtArgs>>): Prisma__ProductionReportClient<$Result.GetResult<Prisma.$ProductionReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InventoryTxn model
   */
  interface InventoryTxnFieldRefs {
    readonly id: FieldRef<"InventoryTxn", 'String'>
    readonly groupId: FieldRef<"InventoryTxn", 'String'>
    readonly date: FieldRef<"InventoryTxn", 'DateTime'>
    readonly type: FieldRef<"InventoryTxn", 'TxnType'>
    readonly itemId: FieldRef<"InventoryTxn", 'String'>
    readonly qty: FieldRef<"InventoryTxn", 'Decimal'>
    readonly itemMasterId: FieldRef<"InventoryTxn", 'Int'>
    readonly locationId: FieldRef<"InventoryTxn", 'Int'>
    readonly proId: FieldRef<"InventoryTxn", 'Int'>
    readonly prosesId: FieldRef<"InventoryTxn", 'Int'>
    readonly productionReportId: FieldRef<"InventoryTxn", 'String'>
    readonly notes: FieldRef<"InventoryTxn", 'String'>
    readonly createdAt: FieldRef<"InventoryTxn", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryTxn findUnique
   */
  export type InventoryTxnFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter, which InventoryTxn to fetch.
     */
    where: InventoryTxnWhereUniqueInput
  }

  /**
   * InventoryTxn findUniqueOrThrow
   */
  export type InventoryTxnFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter, which InventoryTxn to fetch.
     */
    where: InventoryTxnWhereUniqueInput
  }

  /**
   * InventoryTxn findFirst
   */
  export type InventoryTxnFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter, which InventoryTxn to fetch.
     */
    where?: InventoryTxnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryTxns to fetch.
     */
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryTxns.
     */
    cursor?: InventoryTxnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryTxns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryTxns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryTxns.
     */
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * InventoryTxn findFirstOrThrow
   */
  export type InventoryTxnFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter, which InventoryTxn to fetch.
     */
    where?: InventoryTxnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryTxns to fetch.
     */
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryTxns.
     */
    cursor?: InventoryTxnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryTxns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryTxns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryTxns.
     */
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * InventoryTxn findMany
   */
  export type InventoryTxnFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter, which InventoryTxns to fetch.
     */
    where?: InventoryTxnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryTxns to fetch.
     */
    orderBy?: InventoryTxnOrderByWithRelationInput | InventoryTxnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryTxns.
     */
    cursor?: InventoryTxnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryTxns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryTxns.
     */
    skip?: number
    distinct?: InventoryTxnScalarFieldEnum | InventoryTxnScalarFieldEnum[]
  }

  /**
   * InventoryTxn create
   */
  export type InventoryTxnCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryTxn.
     */
    data: XOR<InventoryTxnCreateInput, InventoryTxnUncheckedCreateInput>
  }

  /**
   * InventoryTxn createMany
   */
  export type InventoryTxnCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryTxns.
     */
    data: InventoryTxnCreateManyInput | InventoryTxnCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryTxn update
   */
  export type InventoryTxnUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryTxn.
     */
    data: XOR<InventoryTxnUpdateInput, InventoryTxnUncheckedUpdateInput>
    /**
     * Choose, which InventoryTxn to update.
     */
    where: InventoryTxnWhereUniqueInput
  }

  /**
   * InventoryTxn updateMany
   */
  export type InventoryTxnUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryTxns.
     */
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyInput>
    /**
     * Filter which InventoryTxns to update
     */
    where?: InventoryTxnWhereInput
    /**
     * Limit how many InventoryTxns to update.
     */
    limit?: number
  }

  /**
   * InventoryTxn upsert
   */
  export type InventoryTxnUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryTxn to update in case it exists.
     */
    where: InventoryTxnWhereUniqueInput
    /**
     * In case the InventoryTxn found by the `where` argument doesn't exist, create a new InventoryTxn with this data.
     */
    create: XOR<InventoryTxnCreateInput, InventoryTxnUncheckedCreateInput>
    /**
     * In case the InventoryTxn was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryTxnUpdateInput, InventoryTxnUncheckedUpdateInput>
  }

  /**
   * InventoryTxn delete
   */
  export type InventoryTxnDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
    /**
     * Filter which InventoryTxn to delete.
     */
    where: InventoryTxnWhereUniqueInput
  }

  /**
   * InventoryTxn deleteMany
   */
  export type InventoryTxnDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryTxns to delete
     */
    where?: InventoryTxnWhereInput
    /**
     * Limit how many InventoryTxns to delete.
     */
    limit?: number
  }

  /**
   * InventoryTxn.itemMaster
   */
  export type InventoryTxn$itemMasterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Item
     */
    omit?: ItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    where?: ItemWhereInput
  }

  /**
   * InventoryTxn.pro
   */
  export type InventoryTxn$proArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  }

  /**
   * InventoryTxn.proses
   */
  export type InventoryTxn$prosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proses
     */
    select?: ProsesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Proses
     */
    omit?: ProsesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProsesInclude<ExtArgs> | null
    where?: ProsesWhereInput
  }

  /**
   * InventoryTxn.productionReport
   */
  export type InventoryTxn$productionReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
  }

  /**
   * InventoryTxn without action
   */
  export type InventoryTxnDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryTxn
     */
    select?: InventoryTxnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryTxn
     */
    omit?: InventoryTxnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryTxnInclude<ExtArgs> | null
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
    department: 'department',
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
    cycleTimeSec: 'cycleTimeSec',
    cycleTimeMin: 'cycleTimeMin',
    cavity: 'cavity',
    manPower: 'manPower',
    stdOutputPerDay: 'stdOutputPerDay',
    workCenter: 'workCenter',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MachineScalarFieldEnum = (typeof MachineScalarFieldEnum)[keyof typeof MachineScalarFieldEnum]


  export const MaterialScalarFieldEnum: {
    id: 'id',
    name: 'name',
    uom: 'uom',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    itemId: 'itemId'
  };

  export type MaterialScalarFieldEnum = (typeof MaterialScalarFieldEnum)[keyof typeof MaterialScalarFieldEnum]


  export const ItemScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    kind: 'kind',
    status: 'status',
    baseUom: 'baseUom',
    createdById: 'createdById',
    createdFrom: 'createdFrom',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum]


  export const ProPrefixScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    type: 'type'
  };

  export type ProPrefixScalarFieldEnum = (typeof ProPrefixScalarFieldEnum)[keyof typeof ProPrefixScalarFieldEnum]


  export const ProSequenceScalarFieldEnum: {
    prefix: 'prefix',
    last: 'last'
  };

  export type ProSequenceScalarFieldEnum = (typeof ProSequenceScalarFieldEnum)[keyof typeof ProSequenceScalarFieldEnum]


  export const ProScalarFieldEnum: {
    id: 'id',
    proNumber: 'proNumber',
    productName: 'productName',
    partNumber: 'partNumber',
    qtyPoPcs: 'qtyPoPcs',
    startDate: 'startDate',
    status: 'status',
    type: 'type',
    autoShiftExpansion: 'autoShiftExpansion',
    proPrefixId: 'proPrefixId',
    fgItemId: 'fgItemId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProScalarFieldEnum = (typeof ProScalarFieldEnum)[keyof typeof ProScalarFieldEnum]


  export const ProsesScalarFieldEnum: {
    id: 'id',
    proId: 'proId',
    orderNo: 'orderNo',
    up: 'up',
    estimatedShifts: 'estimatedShifts',
    startDate: 'startDate',
    machineId: 'machineId',
    partNumber: 'partNumber',
    batchNo: 'batchNo',
    outputItemId: 'outputItemId'
  };

  export type ProsesScalarFieldEnum = (typeof ProsesScalarFieldEnum)[keyof typeof ProsesScalarFieldEnum]


  export const ProsesMaterialScalarFieldEnum: {
    id: 'id',
    prosesId: 'prosesId',
    materialId: 'materialId',
    qtyReq: 'qtyReq'
  };

  export type ProsesMaterialScalarFieldEnum = (typeof ProsesMaterialScalarFieldEnum)[keyof typeof ProsesMaterialScalarFieldEnum]


  export const ProductionReportScalarFieldEnum: {
    id: 'id',
    prosesId: 'prosesId',
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
    qtyReject: 'qtyReject',
    rejectBreakdown: 'rejectBreakdown',
    downtimeBreakdown: 'downtimeBreakdown',
    totalDowntime: 'totalDowntime',
    notes: 'notes',
    othersNote: 'othersNote',
    adminNote: 'adminNote',
    metaData: 'metaData',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    status: 'status',
    rejectionNote: 'rejectionNote',
    checkedById: 'checkedById',
    checkedAt: 'checkedAt',
    voidedAt: 'voidedAt',
    voidedById: 'voidedById',
    voidReason: 'voidReason',
    stockPostedAt: 'stockPostedAt',
    inputWipQty: 'inputWipQty'
  };

  export type ProductionReportScalarFieldEnum = (typeof ProductionReportScalarFieldEnum)[keyof typeof ProductionReportScalarFieldEnum]


  export const InventoryLocationScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    type: 'type',
    machineId: 'machineId'
  };

  export type InventoryLocationScalarFieldEnum = (typeof InventoryLocationScalarFieldEnum)[keyof typeof InventoryLocationScalarFieldEnum]


  export const InventoryTxnScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    date: 'date',
    type: 'type',
    itemId: 'itemId',
    qty: 'qty',
    itemMasterId: 'itemMasterId',
    locationId: 'locationId',
    proId: 'proId',
    prosesId: 'prosesId',
    productionReportId: 'productionReportId',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type InventoryTxnScalarFieldEnum = (typeof InventoryTxnScalarFieldEnum)[keyof typeof InventoryTxnScalarFieldEnum]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    username: 'username',
    passwordHash: 'passwordHash',
    department: 'department'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const MachineOrderByRelevanceFieldEnum: {
    name: 'name',
    remark: 'remark',
    workCenter: 'workCenter'
  };

  export type MachineOrderByRelevanceFieldEnum = (typeof MachineOrderByRelevanceFieldEnum)[keyof typeof MachineOrderByRelevanceFieldEnum]


  export const MaterialOrderByRelevanceFieldEnum: {
    name: 'name',
    uom: 'uom'
  };

  export type MaterialOrderByRelevanceFieldEnum = (typeof MaterialOrderByRelevanceFieldEnum)[keyof typeof MaterialOrderByRelevanceFieldEnum]


  export const ItemOrderByRelevanceFieldEnum: {
    code: 'code',
    name: 'name',
    baseUom: 'baseUom',
    createdById: 'createdById',
    createdFrom: 'createdFrom'
  };

  export type ItemOrderByRelevanceFieldEnum = (typeof ItemOrderByRelevanceFieldEnum)[keyof typeof ItemOrderByRelevanceFieldEnum]


  export const ProPrefixOrderByRelevanceFieldEnum: {
    code: 'code',
    name: 'name'
  };

  export type ProPrefixOrderByRelevanceFieldEnum = (typeof ProPrefixOrderByRelevanceFieldEnum)[keyof typeof ProPrefixOrderByRelevanceFieldEnum]


  export const ProSequenceOrderByRelevanceFieldEnum: {
    prefix: 'prefix'
  };

  export type ProSequenceOrderByRelevanceFieldEnum = (typeof ProSequenceOrderByRelevanceFieldEnum)[keyof typeof ProSequenceOrderByRelevanceFieldEnum]


  export const ProOrderByRelevanceFieldEnum: {
    proNumber: 'proNumber',
    productName: 'productName',
    partNumber: 'partNumber'
  };

  export type ProOrderByRelevanceFieldEnum = (typeof ProOrderByRelevanceFieldEnum)[keyof typeof ProOrderByRelevanceFieldEnum]


  export const ProsesOrderByRelevanceFieldEnum: {
    partNumber: 'partNumber',
    batchNo: 'batchNo'
  };

  export type ProsesOrderByRelevanceFieldEnum = (typeof ProsesOrderByRelevanceFieldEnum)[keyof typeof ProsesOrderByRelevanceFieldEnum]


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
    notes: 'notes',
    othersNote: 'othersNote',
    adminNote: 'adminNote',
    createdById: 'createdById',
    rejectionNote: 'rejectionNote',
    checkedById: 'checkedById',
    voidedById: 'voidedById',
    voidReason: 'voidReason'
  };

  export type ProductionReportOrderByRelevanceFieldEnum = (typeof ProductionReportOrderByRelevanceFieldEnum)[keyof typeof ProductionReportOrderByRelevanceFieldEnum]


  export const InventoryLocationOrderByRelevanceFieldEnum: {
    code: 'code',
    name: 'name'
  };

  export type InventoryLocationOrderByRelevanceFieldEnum = (typeof InventoryLocationOrderByRelevanceFieldEnum)[keyof typeof InventoryLocationOrderByRelevanceFieldEnum]


  export const InventoryTxnOrderByRelevanceFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    itemId: 'itemId',
    productionReportId: 'productionReportId',
    notes: 'notes'
  };

  export type InventoryTxnOrderByRelevanceFieldEnum = (typeof InventoryTxnOrderByRelevanceFieldEnum)[keyof typeof InventoryTxnOrderByRelevanceFieldEnum]


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
   * Reference to a field of type 'MaterialType'
   */
  export type EnumMaterialTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaterialType'>
    


  /**
   * Reference to a field of type 'ItemKind'
   */
  export type EnumItemKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemKind'>
    


  /**
   * Reference to a field of type 'ItemStatus'
   */
  export type EnumItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemStatus'>
    


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
   * Reference to a field of type 'ReportStatus'
   */
  export type EnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus'>
    


  /**
   * Reference to a field of type 'LocationType'
   */
  export type EnumLocationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationType'>
    


  /**
   * Reference to a field of type 'TxnType'
   */
  export type EnumTxnTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TxnType'>
    


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
    department?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    productionReports?: ProductionReportListRelationFilter
    checkedProductionReports?: ProductionReportListRelationFilter
    createdItems?: ItemListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    productionReports?: ProductionReportOrderByRelationAggregateInput
    checkedProductionReports?: ProductionReportOrderByRelationAggregateInput
    createdItems?: ItemOrderByRelationAggregateInput
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
    department?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    productionReports?: ProductionReportListRelationFilter
    checkedProductionReports?: ProductionReportListRelationFilter
    createdItems?: ItemListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
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
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
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
    cycleTimeSec?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableFilter<"Machine"> | number | null
    manPower?: IntNullableFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableFilter<"Machine"> | number | null
    workCenter?: StringNullableFilter<"Machine"> | string | null
    createdAt?: DateTimeFilter<"Machine"> | Date | string
    updatedAt?: DateTimeFilter<"Machine"> | Date | string
    proses?: ProsesListRelationFilter
    location?: XOR<InventoryLocationNullableScalarRelationFilter, InventoryLocationWhereInput> | null
  }

  export type MachineOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrderInput | SortOrder
    cycleTimeSec?: SortOrderInput | SortOrder
    cycleTimeMin?: SortOrderInput | SortOrder
    cavity?: SortOrderInput | SortOrder
    manPower?: SortOrderInput | SortOrder
    stdOutputPerDay?: SortOrderInput | SortOrder
    workCenter?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    proses?: ProsesOrderByRelationAggregateInput
    location?: InventoryLocationOrderByWithRelationInput
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
    cycleTimeSec?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableFilter<"Machine"> | number | null
    manPower?: IntNullableFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableFilter<"Machine"> | number | null
    workCenter?: StringNullableFilter<"Machine"> | string | null
    createdAt?: DateTimeFilter<"Machine"> | Date | string
    updatedAt?: DateTimeFilter<"Machine"> | Date | string
    proses?: ProsesListRelationFilter
    location?: XOR<InventoryLocationNullableScalarRelationFilter, InventoryLocationWhereInput> | null
  }, "id">

  export type MachineOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    stdOutputPerHour?: SortOrder
    stdOutputPerShift?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    remark?: SortOrderInput | SortOrder
    cycleTimeSec?: SortOrderInput | SortOrder
    cycleTimeMin?: SortOrderInput | SortOrder
    cavity?: SortOrderInput | SortOrder
    manPower?: SortOrderInput | SortOrder
    stdOutputPerDay?: SortOrderInput | SortOrder
    workCenter?: SortOrderInput | SortOrder
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
    cycleTimeSec?: DecimalNullableWithAggregatesFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: DecimalNullableWithAggregatesFilter<"Machine"> | Decimal | DecimalJsLike | number | string | null
    cavity?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    manPower?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    stdOutputPerDay?: IntNullableWithAggregatesFilter<"Machine"> | number | null
    workCenter?: StringNullableWithAggregatesFilter<"Machine"> | string | null
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
    type?: EnumMaterialTypeFilter<"Material"> | $Enums.MaterialType
    createdAt?: DateTimeFilter<"Material"> | Date | string
    updatedAt?: DateTimeFilter<"Material"> | Date | string
    itemId?: IntNullableFilter<"Material"> | number | null
    prosesMaterials?: ProsesMaterialListRelationFilter
    item?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
  }

  export type MaterialOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemId?: SortOrderInput | SortOrder
    prosesMaterials?: ProsesMaterialOrderByRelationAggregateInput
    item?: ItemOrderByWithRelationInput
    _relevance?: MaterialOrderByRelevanceInput
  }

  export type MaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    itemId?: number
    AND?: MaterialWhereInput | MaterialWhereInput[]
    OR?: MaterialWhereInput[]
    NOT?: MaterialWhereInput | MaterialWhereInput[]
    uom?: StringFilter<"Material"> | string
    type?: EnumMaterialTypeFilter<"Material"> | $Enums.MaterialType
    createdAt?: DateTimeFilter<"Material"> | Date | string
    updatedAt?: DateTimeFilter<"Material"> | Date | string
    prosesMaterials?: ProsesMaterialListRelationFilter
    item?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
  }, "id" | "name" | "itemId">

  export type MaterialOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemId?: SortOrderInput | SortOrder
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
    type?: EnumMaterialTypeWithAggregatesFilter<"Material"> | $Enums.MaterialType
    createdAt?: DateTimeWithAggregatesFilter<"Material"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Material"> | Date | string
    itemId?: IntNullableWithAggregatesFilter<"Material"> | number | null
  }

  export type ItemWhereInput = {
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    id?: IntFilter<"Item"> | number
    code?: StringFilter<"Item"> | string
    name?: StringFilter<"Item"> | string
    kind?: EnumItemKindFilter<"Item"> | $Enums.ItemKind
    status?: EnumItemStatusFilter<"Item"> | $Enums.ItemStatus
    baseUom?: StringNullableFilter<"Item"> | string | null
    createdById?: StringNullableFilter<"Item"> | string | null
    createdFrom?: StringNullableFilter<"Item"> | string | null
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    inventoryTxns?: InventoryTxnListRelationFilter
    material?: XOR<MaterialNullableScalarRelationFilter, MaterialWhereInput> | null
    fgPros?: ProListRelationFilter
    outputProses?: ProsesListRelationFilter
  }

  export type ItemOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    baseUom?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdFrom?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    inventoryTxns?: InventoryTxnOrderByRelationAggregateInput
    material?: MaterialOrderByWithRelationInput
    fgPros?: ProOrderByRelationAggregateInput
    outputProses?: ProsesOrderByRelationAggregateInput
    _relevance?: ItemOrderByRelevanceInput
  }

  export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    name?: StringFilter<"Item"> | string
    kind?: EnumItemKindFilter<"Item"> | $Enums.ItemKind
    status?: EnumItemStatusFilter<"Item"> | $Enums.ItemStatus
    baseUom?: StringNullableFilter<"Item"> | string | null
    createdById?: StringNullableFilter<"Item"> | string | null
    createdFrom?: StringNullableFilter<"Item"> | string | null
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    inventoryTxns?: InventoryTxnListRelationFilter
    material?: XOR<MaterialNullableScalarRelationFilter, MaterialWhereInput> | null
    fgPros?: ProListRelationFilter
    outputProses?: ProsesListRelationFilter
  }, "id" | "code">

  export type ItemOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    baseUom?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdFrom?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItemCountOrderByAggregateInput
    _avg?: ItemAvgOrderByAggregateInput
    _max?: ItemMaxOrderByAggregateInput
    _min?: ItemMinOrderByAggregateInput
    _sum?: ItemSumOrderByAggregateInput
  }

  export type ItemScalarWhereWithAggregatesInput = {
    AND?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    OR?: ItemScalarWhereWithAggregatesInput[]
    NOT?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Item"> | number
    code?: StringWithAggregatesFilter<"Item"> | string
    name?: StringWithAggregatesFilter<"Item"> | string
    kind?: EnumItemKindWithAggregatesFilter<"Item"> | $Enums.ItemKind
    status?: EnumItemStatusWithAggregatesFilter<"Item"> | $Enums.ItemStatus
    baseUom?: StringNullableWithAggregatesFilter<"Item"> | string | null
    createdById?: StringNullableWithAggregatesFilter<"Item"> | string | null
    createdFrom?: StringNullableWithAggregatesFilter<"Item"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
  }

  export type ProPrefixWhereInput = {
    AND?: ProPrefixWhereInput | ProPrefixWhereInput[]
    OR?: ProPrefixWhereInput[]
    NOT?: ProPrefixWhereInput | ProPrefixWhereInput[]
    id?: IntFilter<"ProPrefix"> | number
    code?: StringFilter<"ProPrefix"> | string
    name?: StringFilter<"ProPrefix"> | string
    type?: EnumProTypeFilter<"ProPrefix"> | $Enums.ProType
    pros?: ProListRelationFilter
  }

  export type ProPrefixOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    pros?: ProOrderByRelationAggregateInput
    _relevance?: ProPrefixOrderByRelevanceInput
  }

  export type ProPrefixWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    name?: string
    AND?: ProPrefixWhereInput | ProPrefixWhereInput[]
    OR?: ProPrefixWhereInput[]
    NOT?: ProPrefixWhereInput | ProPrefixWhereInput[]
    type?: EnumProTypeFilter<"ProPrefix"> | $Enums.ProType
    pros?: ProListRelationFilter
  }, "id" | "code" | "name">

  export type ProPrefixOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    _count?: ProPrefixCountOrderByAggregateInput
    _avg?: ProPrefixAvgOrderByAggregateInput
    _max?: ProPrefixMaxOrderByAggregateInput
    _min?: ProPrefixMinOrderByAggregateInput
    _sum?: ProPrefixSumOrderByAggregateInput
  }

  export type ProPrefixScalarWhereWithAggregatesInput = {
    AND?: ProPrefixScalarWhereWithAggregatesInput | ProPrefixScalarWhereWithAggregatesInput[]
    OR?: ProPrefixScalarWhereWithAggregatesInput[]
    NOT?: ProPrefixScalarWhereWithAggregatesInput | ProPrefixScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProPrefix"> | number
    code?: StringWithAggregatesFilter<"ProPrefix"> | string
    name?: StringWithAggregatesFilter<"ProPrefix"> | string
    type?: EnumProTypeWithAggregatesFilter<"ProPrefix"> | $Enums.ProType
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
    partNumber?: StringNullableFilter<"Pro"> | string | null
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    proPrefixId?: IntNullableFilter<"Pro"> | number | null
    fgItemId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
    proPrefix?: XOR<ProPrefixNullableScalarRelationFilter, ProPrefixWhereInput> | null
    fgItem?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    proses?: ProsesListRelationFilter
    inventoryTxns?: InventoryTxnListRelationFilter
  }

  export type ProOrderByWithRelationInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    partNumber?: SortOrderInput | SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    proPrefixId?: SortOrderInput | SortOrder
    fgItemId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    proPrefix?: ProPrefixOrderByWithRelationInput
    fgItem?: ItemOrderByWithRelationInput
    proses?: ProsesOrderByRelationAggregateInput
    inventoryTxns?: InventoryTxnOrderByRelationAggregateInput
    _relevance?: ProOrderByRelevanceInput
  }

  export type ProWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    proNumber?: string
    AND?: ProWhereInput | ProWhereInput[]
    OR?: ProWhereInput[]
    NOT?: ProWhereInput | ProWhereInput[]
    productName?: StringFilter<"Pro"> | string
    partNumber?: StringNullableFilter<"Pro"> | string | null
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    proPrefixId?: IntNullableFilter<"Pro"> | number | null
    fgItemId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
    proPrefix?: XOR<ProPrefixNullableScalarRelationFilter, ProPrefixWhereInput> | null
    fgItem?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    proses?: ProsesListRelationFilter
    inventoryTxns?: InventoryTxnListRelationFilter
  }, "id" | "proNumber">

  export type ProOrderByWithAggregationInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    partNumber?: SortOrderInput | SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrderInput | SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    proPrefixId?: SortOrderInput | SortOrder
    fgItemId?: SortOrderInput | SortOrder
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
    partNumber?: StringNullableWithAggregatesFilter<"Pro"> | string | null
    qtyPoPcs?: IntWithAggregatesFilter<"Pro"> | number
    startDate?: DateTimeNullableWithAggregatesFilter<"Pro"> | Date | string | null
    status?: EnumProStatusWithAggregatesFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeWithAggregatesFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolWithAggregatesFilter<"Pro"> | boolean
    proPrefixId?: IntNullableWithAggregatesFilter<"Pro"> | number | null
    fgItemId?: IntNullableWithAggregatesFilter<"Pro"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Pro"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pro"> | Date | string
  }

  export type ProsesWhereInput = {
    AND?: ProsesWhereInput | ProsesWhereInput[]
    OR?: ProsesWhereInput[]
    NOT?: ProsesWhereInput | ProsesWhereInput[]
    id?: IntFilter<"Proses"> | number
    proId?: IntFilter<"Proses"> | number
    orderNo?: IntFilter<"Proses"> | number
    up?: IntNullableFilter<"Proses"> | number | null
    estimatedShifts?: IntNullableFilter<"Proses"> | number | null
    startDate?: DateTimeNullableFilter<"Proses"> | Date | string | null
    machineId?: IntNullableFilter<"Proses"> | number | null
    partNumber?: StringNullableFilter<"Proses"> | string | null
    batchNo?: StringNullableFilter<"Proses"> | string | null
    outputItemId?: IntNullableFilter<"Proses"> | number | null
    pro?: XOR<ProScalarRelationFilter, ProWhereInput>
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    outputItem?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    materials?: ProsesMaterialListRelationFilter
    productionReports?: ProductionReportListRelationFilter
    inventoryTxns?: InventoryTxnListRelationFilter
  }

  export type ProsesOrderByWithRelationInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrderInput | SortOrder
    estimatedShifts?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    machineId?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    batchNo?: SortOrderInput | SortOrder
    outputItemId?: SortOrderInput | SortOrder
    pro?: ProOrderByWithRelationInput
    machine?: MachineOrderByWithRelationInput
    outputItem?: ItemOrderByWithRelationInput
    materials?: ProsesMaterialOrderByRelationAggregateInput
    productionReports?: ProductionReportOrderByRelationAggregateInput
    inventoryTxns?: InventoryTxnOrderByRelationAggregateInput
    _relevance?: ProsesOrderByRelevanceInput
  }

  export type ProsesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    proId_orderNo?: ProsesProIdOrderNoCompoundUniqueInput
    AND?: ProsesWhereInput | ProsesWhereInput[]
    OR?: ProsesWhereInput[]
    NOT?: ProsesWhereInput | ProsesWhereInput[]
    proId?: IntFilter<"Proses"> | number
    orderNo?: IntFilter<"Proses"> | number
    up?: IntNullableFilter<"Proses"> | number | null
    estimatedShifts?: IntNullableFilter<"Proses"> | number | null
    startDate?: DateTimeNullableFilter<"Proses"> | Date | string | null
    machineId?: IntNullableFilter<"Proses"> | number | null
    partNumber?: StringNullableFilter<"Proses"> | string | null
    batchNo?: StringNullableFilter<"Proses"> | string | null
    outputItemId?: IntNullableFilter<"Proses"> | number | null
    pro?: XOR<ProScalarRelationFilter, ProWhereInput>
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    outputItem?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    materials?: ProsesMaterialListRelationFilter
    productionReports?: ProductionReportListRelationFilter
    inventoryTxns?: InventoryTxnListRelationFilter
  }, "id" | "proId_orderNo">

  export type ProsesOrderByWithAggregationInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrderInput | SortOrder
    estimatedShifts?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    machineId?: SortOrderInput | SortOrder
    partNumber?: SortOrderInput | SortOrder
    batchNo?: SortOrderInput | SortOrder
    outputItemId?: SortOrderInput | SortOrder
    _count?: ProsesCountOrderByAggregateInput
    _avg?: ProsesAvgOrderByAggregateInput
    _max?: ProsesMaxOrderByAggregateInput
    _min?: ProsesMinOrderByAggregateInput
    _sum?: ProsesSumOrderByAggregateInput
  }

  export type ProsesScalarWhereWithAggregatesInput = {
    AND?: ProsesScalarWhereWithAggregatesInput | ProsesScalarWhereWithAggregatesInput[]
    OR?: ProsesScalarWhereWithAggregatesInput[]
    NOT?: ProsesScalarWhereWithAggregatesInput | ProsesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Proses"> | number
    proId?: IntWithAggregatesFilter<"Proses"> | number
    orderNo?: IntWithAggregatesFilter<"Proses"> | number
    up?: IntNullableWithAggregatesFilter<"Proses"> | number | null
    estimatedShifts?: IntNullableWithAggregatesFilter<"Proses"> | number | null
    startDate?: DateTimeNullableWithAggregatesFilter<"Proses"> | Date | string | null
    machineId?: IntNullableWithAggregatesFilter<"Proses"> | number | null
    partNumber?: StringNullableWithAggregatesFilter<"Proses"> | string | null
    batchNo?: StringNullableWithAggregatesFilter<"Proses"> | string | null
    outputItemId?: IntNullableWithAggregatesFilter<"Proses"> | number | null
  }

  export type ProsesMaterialWhereInput = {
    AND?: ProsesMaterialWhereInput | ProsesMaterialWhereInput[]
    OR?: ProsesMaterialWhereInput[]
    NOT?: ProsesMaterialWhereInput | ProsesMaterialWhereInput[]
    id?: IntFilter<"ProsesMaterial"> | number
    prosesId?: IntFilter<"ProsesMaterial"> | number
    materialId?: IntFilter<"ProsesMaterial"> | number
    qtyReq?: DecimalFilter<"ProsesMaterial"> | Decimal | DecimalJsLike | number | string
    proses?: XOR<ProsesScalarRelationFilter, ProsesWhereInput>
    material?: XOR<MaterialScalarRelationFilter, MaterialWhereInput>
  }

  export type ProsesMaterialOrderByWithRelationInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
    proses?: ProsesOrderByWithRelationInput
    material?: MaterialOrderByWithRelationInput
  }

  export type ProsesMaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    prosesId_materialId?: ProsesMaterialProsesIdMaterialIdCompoundUniqueInput
    AND?: ProsesMaterialWhereInput | ProsesMaterialWhereInput[]
    OR?: ProsesMaterialWhereInput[]
    NOT?: ProsesMaterialWhereInput | ProsesMaterialWhereInput[]
    prosesId?: IntFilter<"ProsesMaterial"> | number
    materialId?: IntFilter<"ProsesMaterial"> | number
    qtyReq?: DecimalFilter<"ProsesMaterial"> | Decimal | DecimalJsLike | number | string
    proses?: XOR<ProsesScalarRelationFilter, ProsesWhereInput>
    material?: XOR<MaterialScalarRelationFilter, MaterialWhereInput>
  }, "id" | "prosesId_materialId">

  export type ProsesMaterialOrderByWithAggregationInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
    _count?: ProsesMaterialCountOrderByAggregateInput
    _avg?: ProsesMaterialAvgOrderByAggregateInput
    _max?: ProsesMaterialMaxOrderByAggregateInput
    _min?: ProsesMaterialMinOrderByAggregateInput
    _sum?: ProsesMaterialSumOrderByAggregateInput
  }

  export type ProsesMaterialScalarWhereWithAggregatesInput = {
    AND?: ProsesMaterialScalarWhereWithAggregatesInput | ProsesMaterialScalarWhereWithAggregatesInput[]
    OR?: ProsesMaterialScalarWhereWithAggregatesInput[]
    NOT?: ProsesMaterialScalarWhereWithAggregatesInput | ProsesMaterialScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProsesMaterial"> | number
    prosesId?: IntWithAggregatesFilter<"ProsesMaterial"> | number
    materialId?: IntWithAggregatesFilter<"ProsesMaterial"> | number
    qtyReq?: DecimalWithAggregatesFilter<"ProsesMaterial"> | Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportWhereInput = {
    AND?: ProductionReportWhereInput | ProductionReportWhereInput[]
    OR?: ProductionReportWhereInput[]
    NOT?: ProductionReportWhereInput | ProductionReportWhereInput[]
    id?: StringFilter<"ProductionReport"> | string
    prosesId?: IntFilter<"ProductionReport"> | number
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
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    othersNote?: StringNullableFilter<"ProductionReport"> | string | null
    adminNote?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdById?: StringNullableFilter<"ProductionReport"> | string | null
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
    status?: EnumReportStatusFilter<"ProductionReport"> | $Enums.ReportStatus
    rejectionNote?: StringNullableFilter<"ProductionReport"> | string | null
    checkedById?: StringNullableFilter<"ProductionReport"> | string | null
    checkedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedById?: StringNullableFilter<"ProductionReport"> | string | null
    voidReason?: StringNullableFilter<"ProductionReport"> | string | null
    stockPostedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    inputWipQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    proses?: XOR<ProsesScalarRelationFilter, ProsesWhereInput>
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    checkedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    inventoryTxns?: InventoryTxnListRelationFilter
  }

  export type ProductionReportOrderByWithRelationInput = {
    id?: SortOrder
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrderInput | SortOrder
    downtimeBreakdown?: SortOrderInput | SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrderInput | SortOrder
    othersNote?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    metaData?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    rejectionNote?: SortOrderInput | SortOrder
    checkedById?: SortOrderInput | SortOrder
    checkedAt?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    voidedById?: SortOrderInput | SortOrder
    voidReason?: SortOrderInput | SortOrder
    stockPostedAt?: SortOrderInput | SortOrder
    inputWipQty?: SortOrderInput | SortOrder
    proses?: ProsesOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    checkedBy?: UserOrderByWithRelationInput
    inventoryTxns?: InventoryTxnOrderByRelationAggregateInput
    _relevance?: ProductionReportOrderByRelevanceInput
  }

  export type ProductionReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductionReportWhereInput | ProductionReportWhereInput[]
    OR?: ProductionReportWhereInput[]
    NOT?: ProductionReportWhereInput | ProductionReportWhereInput[]
    prosesId?: IntFilter<"ProductionReport"> | number
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
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    othersNote?: StringNullableFilter<"ProductionReport"> | string | null
    adminNote?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdById?: StringNullableFilter<"ProductionReport"> | string | null
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
    status?: EnumReportStatusFilter<"ProductionReport"> | $Enums.ReportStatus
    rejectionNote?: StringNullableFilter<"ProductionReport"> | string | null
    checkedById?: StringNullableFilter<"ProductionReport"> | string | null
    checkedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedById?: StringNullableFilter<"ProductionReport"> | string | null
    voidReason?: StringNullableFilter<"ProductionReport"> | string | null
    stockPostedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    inputWipQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
    proses?: XOR<ProsesScalarRelationFilter, ProsesWhereInput>
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    checkedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    inventoryTxns?: InventoryTxnListRelationFilter
  }, "id">

  export type ProductionReportOrderByWithAggregationInput = {
    id?: SortOrder
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrderInput | SortOrder
    downtimeBreakdown?: SortOrderInput | SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrderInput | SortOrder
    othersNote?: SortOrderInput | SortOrder
    adminNote?: SortOrderInput | SortOrder
    metaData?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    rejectionNote?: SortOrderInput | SortOrder
    checkedById?: SortOrderInput | SortOrder
    checkedAt?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    voidedById?: SortOrderInput | SortOrder
    voidReason?: SortOrderInput | SortOrder
    stockPostedAt?: SortOrderInput | SortOrder
    inputWipQty?: SortOrderInput | SortOrder
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
    prosesId?: IntWithAggregatesFilter<"ProductionReport"> | number
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
    qtyReject?: DecimalWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableWithAggregatesFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableWithAggregatesFilter<"ProductionReport">
    totalDowntime?: IntWithAggregatesFilter<"ProductionReport"> | number
    notes?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    othersNote?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    adminNote?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableWithAggregatesFilter<"ProductionReport">
    createdById?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductionReport"> | Date | string
    status?: EnumReportStatusWithAggregatesFilter<"ProductionReport"> | $Enums.ReportStatus
    rejectionNote?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    checkedById?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    checkedAt?: DateTimeNullableWithAggregatesFilter<"ProductionReport"> | Date | string | null
    voidedAt?: DateTimeNullableWithAggregatesFilter<"ProductionReport"> | Date | string | null
    voidedById?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    voidReason?: StringNullableWithAggregatesFilter<"ProductionReport"> | string | null
    stockPostedAt?: DateTimeNullableWithAggregatesFilter<"ProductionReport"> | Date | string | null
    inputWipQty?: DecimalNullableWithAggregatesFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
  }

  export type InventoryLocationWhereInput = {
    AND?: InventoryLocationWhereInput | InventoryLocationWhereInput[]
    OR?: InventoryLocationWhereInput[]
    NOT?: InventoryLocationWhereInput | InventoryLocationWhereInput[]
    id?: IntFilter<"InventoryLocation"> | number
    code?: StringFilter<"InventoryLocation"> | string
    name?: StringFilter<"InventoryLocation"> | string
    type?: EnumLocationTypeFilter<"InventoryLocation"> | $Enums.LocationType
    machineId?: IntNullableFilter<"InventoryLocation"> | number | null
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    txns?: InventoryTxnListRelationFilter
  }

  export type InventoryLocationOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    machineId?: SortOrderInput | SortOrder
    machine?: MachineOrderByWithRelationInput
    txns?: InventoryTxnOrderByRelationAggregateInput
    _relevance?: InventoryLocationOrderByRelevanceInput
  }

  export type InventoryLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    machineId?: number
    AND?: InventoryLocationWhereInput | InventoryLocationWhereInput[]
    OR?: InventoryLocationWhereInput[]
    NOT?: InventoryLocationWhereInput | InventoryLocationWhereInput[]
    name?: StringFilter<"InventoryLocation"> | string
    type?: EnumLocationTypeFilter<"InventoryLocation"> | $Enums.LocationType
    machine?: XOR<MachineNullableScalarRelationFilter, MachineWhereInput> | null
    txns?: InventoryTxnListRelationFilter
  }, "id" | "code" | "machineId">

  export type InventoryLocationOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    machineId?: SortOrderInput | SortOrder
    _count?: InventoryLocationCountOrderByAggregateInput
    _avg?: InventoryLocationAvgOrderByAggregateInput
    _max?: InventoryLocationMaxOrderByAggregateInput
    _min?: InventoryLocationMinOrderByAggregateInput
    _sum?: InventoryLocationSumOrderByAggregateInput
  }

  export type InventoryLocationScalarWhereWithAggregatesInput = {
    AND?: InventoryLocationScalarWhereWithAggregatesInput | InventoryLocationScalarWhereWithAggregatesInput[]
    OR?: InventoryLocationScalarWhereWithAggregatesInput[]
    NOT?: InventoryLocationScalarWhereWithAggregatesInput | InventoryLocationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"InventoryLocation"> | number
    code?: StringWithAggregatesFilter<"InventoryLocation"> | string
    name?: StringWithAggregatesFilter<"InventoryLocation"> | string
    type?: EnumLocationTypeWithAggregatesFilter<"InventoryLocation"> | $Enums.LocationType
    machineId?: IntNullableWithAggregatesFilter<"InventoryLocation"> | number | null
  }

  export type InventoryTxnWhereInput = {
    AND?: InventoryTxnWhereInput | InventoryTxnWhereInput[]
    OR?: InventoryTxnWhereInput[]
    NOT?: InventoryTxnWhereInput | InventoryTxnWhereInput[]
    id?: StringFilter<"InventoryTxn"> | string
    groupId?: StringFilter<"InventoryTxn"> | string
    date?: DateTimeFilter<"InventoryTxn"> | Date | string
    type?: EnumTxnTypeFilter<"InventoryTxn"> | $Enums.TxnType
    itemId?: StringFilter<"InventoryTxn"> | string
    qty?: DecimalFilter<"InventoryTxn"> | Decimal | DecimalJsLike | number | string
    itemMasterId?: IntNullableFilter<"InventoryTxn"> | number | null
    locationId?: IntFilter<"InventoryTxn"> | number
    proId?: IntNullableFilter<"InventoryTxn"> | number | null
    prosesId?: IntNullableFilter<"InventoryTxn"> | number | null
    productionReportId?: StringNullableFilter<"InventoryTxn"> | string | null
    notes?: StringNullableFilter<"InventoryTxn"> | string | null
    createdAt?: DateTimeFilter<"InventoryTxn"> | Date | string
    itemMaster?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    location?: XOR<InventoryLocationScalarRelationFilter, InventoryLocationWhereInput>
    pro?: XOR<ProNullableScalarRelationFilter, ProWhereInput> | null
    proses?: XOR<ProsesNullableScalarRelationFilter, ProsesWhereInput> | null
    productionReport?: XOR<ProductionReportNullableScalarRelationFilter, ProductionReportWhereInput> | null
  }

  export type InventoryTxnOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    itemId?: SortOrder
    qty?: SortOrder
    itemMasterId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    proId?: SortOrderInput | SortOrder
    prosesId?: SortOrderInput | SortOrder
    productionReportId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    itemMaster?: ItemOrderByWithRelationInput
    location?: InventoryLocationOrderByWithRelationInput
    pro?: ProOrderByWithRelationInput
    proses?: ProsesOrderByWithRelationInput
    productionReport?: ProductionReportOrderByWithRelationInput
    _relevance?: InventoryTxnOrderByRelevanceInput
  }

  export type InventoryTxnWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productionReportId_itemId_type_locationId?: InventoryTxnProductionReportIdItemIdTypeLocationIdCompoundUniqueInput
    AND?: InventoryTxnWhereInput | InventoryTxnWhereInput[]
    OR?: InventoryTxnWhereInput[]
    NOT?: InventoryTxnWhereInput | InventoryTxnWhereInput[]
    groupId?: StringFilter<"InventoryTxn"> | string
    date?: DateTimeFilter<"InventoryTxn"> | Date | string
    type?: EnumTxnTypeFilter<"InventoryTxn"> | $Enums.TxnType
    itemId?: StringFilter<"InventoryTxn"> | string
    qty?: DecimalFilter<"InventoryTxn"> | Decimal | DecimalJsLike | number | string
    itemMasterId?: IntNullableFilter<"InventoryTxn"> | number | null
    locationId?: IntFilter<"InventoryTxn"> | number
    proId?: IntNullableFilter<"InventoryTxn"> | number | null
    prosesId?: IntNullableFilter<"InventoryTxn"> | number | null
    productionReportId?: StringNullableFilter<"InventoryTxn"> | string | null
    notes?: StringNullableFilter<"InventoryTxn"> | string | null
    createdAt?: DateTimeFilter<"InventoryTxn"> | Date | string
    itemMaster?: XOR<ItemNullableScalarRelationFilter, ItemWhereInput> | null
    location?: XOR<InventoryLocationScalarRelationFilter, InventoryLocationWhereInput>
    pro?: XOR<ProNullableScalarRelationFilter, ProWhereInput> | null
    proses?: XOR<ProsesNullableScalarRelationFilter, ProsesWhereInput> | null
    productionReport?: XOR<ProductionReportNullableScalarRelationFilter, ProductionReportWhereInput> | null
  }, "id" | "productionReportId_itemId_type_locationId">

  export type InventoryTxnOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    itemId?: SortOrder
    qty?: SortOrder
    itemMasterId?: SortOrderInput | SortOrder
    locationId?: SortOrder
    proId?: SortOrderInput | SortOrder
    prosesId?: SortOrderInput | SortOrder
    productionReportId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InventoryTxnCountOrderByAggregateInput
    _avg?: InventoryTxnAvgOrderByAggregateInput
    _max?: InventoryTxnMaxOrderByAggregateInput
    _min?: InventoryTxnMinOrderByAggregateInput
    _sum?: InventoryTxnSumOrderByAggregateInput
  }

  export type InventoryTxnScalarWhereWithAggregatesInput = {
    AND?: InventoryTxnScalarWhereWithAggregatesInput | InventoryTxnScalarWhereWithAggregatesInput[]
    OR?: InventoryTxnScalarWhereWithAggregatesInput[]
    NOT?: InventoryTxnScalarWhereWithAggregatesInput | InventoryTxnScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryTxn"> | string
    groupId?: StringWithAggregatesFilter<"InventoryTxn"> | string
    date?: DateTimeWithAggregatesFilter<"InventoryTxn"> | Date | string
    type?: EnumTxnTypeWithAggregatesFilter<"InventoryTxn"> | $Enums.TxnType
    itemId?: StringWithAggregatesFilter<"InventoryTxn"> | string
    qty?: DecimalWithAggregatesFilter<"InventoryTxn"> | Decimal | DecimalJsLike | number | string
    itemMasterId?: IntNullableWithAggregatesFilter<"InventoryTxn"> | number | null
    locationId?: IntWithAggregatesFilter<"InventoryTxn"> | number
    proId?: IntNullableWithAggregatesFilter<"InventoryTxn"> | number | null
    prosesId?: IntNullableWithAggregatesFilter<"InventoryTxn"> | number | null
    productionReportId?: StringNullableWithAggregatesFilter<"InventoryTxn"> | string | null
    notes?: StringNullableWithAggregatesFilter<"InventoryTxn"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryTxn"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportCreateNestedManyWithoutCreatedByInput
    checkedProductionReports?: ProductionReportCreateNestedManyWithoutCheckedByInput
    createdItems?: ItemCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutCreatedByInput
    checkedProductionReports?: ProductionReportUncheckedCreateNestedManyWithoutCheckedByInput
    createdItems?: ItemUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUpdateManyWithoutCreatedByNestedInput
    checkedProductionReports?: ProductionReportUpdateManyWithoutCheckedByNestedInput
    createdItems?: ItemUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUncheckedUpdateManyWithoutCreatedByNestedInput
    checkedProductionReports?: ProductionReportUncheckedUpdateManyWithoutCheckedByNestedInput
    createdItems?: ItemUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
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
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesCreateNestedManyWithoutMachineInput
    location?: InventoryLocationCreateNestedOneWithoutMachineInput
  }

  export type MachineUncheckedCreateInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutMachineInput
    location?: InventoryLocationUncheckedCreateNestedOneWithoutMachineInput
  }

  export type MachineUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUpdateManyWithoutMachineNestedInput
    location?: InventoryLocationUpdateOneWithoutMachineNestedInput
  }

  export type MachineUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutMachineNestedInput
    location?: InventoryLocationUncheckedUpdateOneWithoutMachineNestedInput
  }

  export type MachineCreateManyInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
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
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
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
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaterialCreateInput = {
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    prosesMaterials?: ProsesMaterialCreateNestedManyWithoutMaterialInput
    item?: ItemCreateNestedOneWithoutMaterialInput
  }

  export type MaterialUncheckedCreateInput = {
    id?: number
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    itemId?: number | null
    prosesMaterials?: ProsesMaterialUncheckedCreateNestedManyWithoutMaterialInput
  }

  export type MaterialUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prosesMaterials?: ProsesMaterialUpdateManyWithoutMaterialNestedInput
    item?: ItemUpdateOneWithoutMaterialNestedInput
  }

  export type MaterialUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesMaterials?: ProsesMaterialUncheckedUpdateManyWithoutMaterialNestedInput
  }

  export type MaterialCreateManyInput = {
    id?: number
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    itemId?: number | null
  }

  export type MaterialUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaterialUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ItemCreateInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedItemsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutItemMasterInput
    material?: MaterialCreateNestedOneWithoutItemInput
    fgPros?: ProCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput
    material?: MaterialUncheckedCreateNestedOneWithoutItemInput
    fgPros?: ProUncheckedCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesUncheckedCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedItemsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUpdateOneWithoutItemNestedInput
    fgPros?: ProUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUncheckedUpdateOneWithoutItemNestedInput
    fgPros?: ProUncheckedUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUncheckedUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemCreateManyInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProPrefixCreateInput = {
    code: string
    name: string
    type?: $Enums.ProType
    pros?: ProCreateNestedManyWithoutProPrefixInput
  }

  export type ProPrefixUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
    pros?: ProUncheckedCreateNestedManyWithoutProPrefixInput
  }

  export type ProPrefixUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    pros?: ProUpdateManyWithoutProPrefixNestedInput
  }

  export type ProPrefixUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    pros?: ProUncheckedUpdateManyWithoutProPrefixNestedInput
  }

  export type ProPrefixCreateManyInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProPrefixUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProPrefixUncheckedUpdateManyInput = {
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
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    proPrefix?: ProPrefixCreateNestedOneWithoutProsInput
    fgItem?: ItemCreateNestedOneWithoutFgProsInput
    proses?: ProsesCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProInput
  }

  export type ProUpdateInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proPrefix?: ProPrefixUpdateOneWithoutProsNestedInput
    fgItem?: ItemUpdateOneWithoutFgProsNestedInput
    proses?: ProsesUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProCreateManyInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProUpdateManyMutationInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
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
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProsesCreateInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    machine?: MachineCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesUpdateInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    machine?: MachineUpdateOneWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type ProsesCreateManyInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
  }

  export type ProsesUpdateManyMutationInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProsesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProsesMaterialCreateInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    proses: ProsesCreateNestedOneWithoutMaterialsInput
    material: MaterialCreateNestedOneWithoutProsesMaterialsInput
  }

  export type ProsesMaterialUncheckedCreateInput = {
    id?: number
    prosesId: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUpdateInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    proses?: ProsesUpdateOneRequiredWithoutMaterialsNestedInput
    material?: MaterialUpdateOneRequiredWithoutProsesMaterialsNestedInput
  }

  export type ProsesMaterialUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    prosesId?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialCreateManyInput = {
    id?: number
    prosesId: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUpdateManyMutationInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    proses: ProsesCreateNestedOneWithoutProductionReportsInput
    createdBy?: UserCreateNestedOneWithoutProductionReportsInput
    checkedBy?: UserCreateNestedOneWithoutCheckedProductionReportsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportUncheckedCreateInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProductionReportInput
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    proses?: ProsesUpdateOneRequiredWithoutProductionReportsNestedInput
    createdBy?: UserUpdateOneWithoutProductionReportsNestedInput
    checkedBy?: UserUpdateOneWithoutCheckedProductionReportsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportCreateManyInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type InventoryLocationCreateInput = {
    code: string
    name: string
    type: $Enums.LocationType
    machine?: MachineCreateNestedOneWithoutLocationInput
    txns?: InventoryTxnCreateNestedManyWithoutLocationInput
  }

  export type InventoryLocationUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    type: $Enums.LocationType
    machineId?: number | null
    txns?: InventoryTxnUncheckedCreateNestedManyWithoutLocationInput
  }

  export type InventoryLocationUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    machine?: MachineUpdateOneWithoutLocationNestedInput
    txns?: InventoryTxnUpdateManyWithoutLocationNestedInput
  }

  export type InventoryLocationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    txns?: InventoryTxnUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type InventoryLocationCreateManyInput = {
    id?: number
    code: string
    name: string
    type: $Enums.LocationType
    machineId?: number | null
  }

  export type InventoryLocationUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
  }

  export type InventoryLocationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type InventoryTxnCreateInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    itemMaster?: ItemCreateNestedOneWithoutInventoryTxnsInput
    location: InventoryLocationCreateNestedOneWithoutTxnsInput
    pro?: ProCreateNestedOneWithoutInventoryTxnsInput
    proses?: ProsesCreateNestedOneWithoutInventoryTxnsInput
    productionReport?: ProductionReportCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemMaster?: ItemUpdateOneWithoutInventoryTxnsNestedInput
    location?: InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput
    pro?: ProUpdateOneWithoutInventoryTxnsNestedInput
    proses?: ProsesUpdateOneWithoutInventoryTxnsNestedInput
    productionReport?: ProductionReportUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnCreateManyInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ProductionReportListRelationFilter = {
    every?: ProductionReportWhereInput
    some?: ProductionReportWhereInput
    none?: ProductionReportWhereInput
  }

  export type ItemListRelationFilter = {
    every?: ItemWhereInput
    some?: ItemWhereInput
    none?: ItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductionReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItemOrderByRelationAggregateInput = {
    _count?: SortOrder
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
    department?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    department?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    department?: SortOrder
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

  export type ProsesListRelationFilter = {
    every?: ProsesWhereInput
    some?: ProsesWhereInput
    none?: ProsesWhereInput
  }

  export type InventoryLocationNullableScalarRelationFilter = {
    is?: InventoryLocationWhereInput | null
    isNot?: InventoryLocationWhereInput | null
  }

  export type ProsesOrderByRelationAggregateInput = {
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
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
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
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
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
    cycleTimeSec?: SortOrder
    cycleTimeMin?: SortOrder
    cavity?: SortOrder
    manPower?: SortOrder
    stdOutputPerDay?: SortOrder
    workCenter?: SortOrder
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

  export type EnumMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaterialType[]
    notIn?: $Enums.MaterialType[]
    not?: NestedEnumMaterialTypeFilter<$PrismaModel> | $Enums.MaterialType
  }

  export type ProsesMaterialListRelationFilter = {
    every?: ProsesMaterialWhereInput
    some?: ProsesMaterialWhereInput
    none?: ProsesMaterialWhereInput
  }

  export type ItemNullableScalarRelationFilter = {
    is?: ItemWhereInput | null
    isNot?: ItemWhereInput | null
  }

  export type ProsesMaterialOrderByRelationAggregateInput = {
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
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemId?: SortOrder
  }

  export type MaterialAvgOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
  }

  export type MaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemId?: SortOrder
  }

  export type MaterialMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uom?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemId?: SortOrder
  }

  export type MaterialSumOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
  }

  export type EnumMaterialTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaterialType[]
    notIn?: $Enums.MaterialType[]
    not?: NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaterialType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaterialTypeFilter<$PrismaModel>
    _max?: NestedEnumMaterialTypeFilter<$PrismaModel>
  }

  export type EnumItemKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemKind | EnumItemKindFieldRefInput<$PrismaModel>
    in?: $Enums.ItemKind[]
    notIn?: $Enums.ItemKind[]
    not?: NestedEnumItemKindFilter<$PrismaModel> | $Enums.ItemKind
  }

  export type EnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[]
    notIn?: $Enums.ItemStatus[]
    not?: NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type InventoryTxnListRelationFilter = {
    every?: InventoryTxnWhereInput
    some?: InventoryTxnWhereInput
    none?: InventoryTxnWhereInput
  }

  export type MaterialNullableScalarRelationFilter = {
    is?: MaterialWhereInput | null
    isNot?: MaterialWhereInput | null
  }

  export type ProListRelationFilter = {
    every?: ProWhereInput
    some?: ProWhereInput
    none?: ProWhereInput
  }

  export type InventoryTxnOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItemOrderByRelevanceInput = {
    fields: ItemOrderByRelevanceFieldEnum | ItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ItemCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    baseUom?: SortOrder
    createdById?: SortOrder
    createdFrom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ItemMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    baseUom?: SortOrder
    createdById?: SortOrder
    createdFrom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    baseUom?: SortOrder
    createdById?: SortOrder
    createdFrom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumItemKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemKind | EnumItemKindFieldRefInput<$PrismaModel>
    in?: $Enums.ItemKind[]
    notIn?: $Enums.ItemKind[]
    not?: NestedEnumItemKindWithAggregatesFilter<$PrismaModel> | $Enums.ItemKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemKindFilter<$PrismaModel>
    _max?: NestedEnumItemKindFilter<$PrismaModel>
  }

  export type EnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[]
    notIn?: $Enums.ItemStatus[]
    not?: NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemStatusFilter<$PrismaModel>
    _max?: NestedEnumItemStatusFilter<$PrismaModel>
  }

  export type EnumProTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProType | EnumProTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProType[]
    notIn?: $Enums.ProType[]
    not?: NestedEnumProTypeFilter<$PrismaModel> | $Enums.ProType
  }

  export type ProPrefixOrderByRelevanceInput = {
    fields: ProPrefixOrderByRelevanceFieldEnum | ProPrefixOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProPrefixCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProPrefixAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProPrefixMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProPrefixMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
  }

  export type ProPrefixSumOrderByAggregateInput = {
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

  export type ProPrefixNullableScalarRelationFilter = {
    is?: ProPrefixWhereInput | null
    isNot?: ProPrefixWhereInput | null
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
    partNumber?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    proPrefixId?: SortOrder
    fgItemId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProAvgOrderByAggregateInput = {
    id?: SortOrder
    qtyPoPcs?: SortOrder
    proPrefixId?: SortOrder
    fgItemId?: SortOrder
  }

  export type ProMaxOrderByAggregateInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    partNumber?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    proPrefixId?: SortOrder
    fgItemId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProMinOrderByAggregateInput = {
    id?: SortOrder
    proNumber?: SortOrder
    productName?: SortOrder
    partNumber?: SortOrder
    qtyPoPcs?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    type?: SortOrder
    autoShiftExpansion?: SortOrder
    proPrefixId?: SortOrder
    fgItemId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProSumOrderByAggregateInput = {
    id?: SortOrder
    qtyPoPcs?: SortOrder
    proPrefixId?: SortOrder
    fgItemId?: SortOrder
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

  export type ProsesOrderByRelevanceInput = {
    fields: ProsesOrderByRelevanceFieldEnum | ProsesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProsesProIdOrderNoCompoundUniqueInput = {
    proId: number
    orderNo: number
  }

  export type ProsesCountOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    batchNo?: SortOrder
    outputItemId?: SortOrder
  }

  export type ProsesAvgOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    machineId?: SortOrder
    outputItemId?: SortOrder
  }

  export type ProsesMaxOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    batchNo?: SortOrder
    outputItemId?: SortOrder
  }

  export type ProsesMinOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    startDate?: SortOrder
    machineId?: SortOrder
    partNumber?: SortOrder
    batchNo?: SortOrder
    outputItemId?: SortOrder
  }

  export type ProsesSumOrderByAggregateInput = {
    id?: SortOrder
    proId?: SortOrder
    orderNo?: SortOrder
    up?: SortOrder
    estimatedShifts?: SortOrder
    machineId?: SortOrder
    outputItemId?: SortOrder
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

  export type ProsesScalarRelationFilter = {
    is?: ProsesWhereInput
    isNot?: ProsesWhereInput
  }

  export type MaterialScalarRelationFilter = {
    is?: MaterialWhereInput
    isNot?: MaterialWhereInput
  }

  export type ProsesMaterialProsesIdMaterialIdCompoundUniqueInput = {
    prosesId: number
    materialId: number
  }

  export type ProsesMaterialCountOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProsesMaterialAvgOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProsesMaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProsesMaterialMinOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
    materialId?: SortOrder
    qtyReq?: SortOrder
  }

  export type ProsesMaterialSumOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
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

  export type EnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[]
    notIn?: $Enums.ReportStatus[]
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type ProductionReportOrderByRelevanceInput = {
    fields: ProductionReportOrderByRelevanceFieldEnum | ProductionReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductionReportCountOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    rejectBreakdown?: SortOrder
    downtimeBreakdown?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    othersNote?: SortOrder
    adminNote?: SortOrder
    metaData?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    rejectionNote?: SortOrder
    checkedById?: SortOrder
    checkedAt?: SortOrder
    voidedAt?: SortOrder
    voidedById?: SortOrder
    voidReason?: SortOrder
    stockPostedAt?: SortOrder
    inputWipQty?: SortOrder
  }

  export type ProductionReportAvgOrderByAggregateInput = {
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    inputWipQty?: SortOrder
  }

  export type ProductionReportMaxOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    othersNote?: SortOrder
    adminNote?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    rejectionNote?: SortOrder
    checkedById?: SortOrder
    checkedAt?: SortOrder
    voidedAt?: SortOrder
    voidedById?: SortOrder
    voidReason?: SortOrder
    stockPostedAt?: SortOrder
    inputWipQty?: SortOrder
  }

  export type ProductionReportMinOrderByAggregateInput = {
    id?: SortOrder
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    notes?: SortOrder
    othersNote?: SortOrder
    adminNote?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    rejectionNote?: SortOrder
    checkedById?: SortOrder
    checkedAt?: SortOrder
    voidedAt?: SortOrder
    voidedById?: SortOrder
    voidReason?: SortOrder
    stockPostedAt?: SortOrder
    inputWipQty?: SortOrder
  }

  export type ProductionReportSumOrderByAggregateInput = {
    prosesId?: SortOrder
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
    qtyReject?: SortOrder
    totalDowntime?: SortOrder
    inputWipQty?: SortOrder
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

  export type EnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[]
    notIn?: $Enums.ReportStatus[]
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type EnumLocationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationType | EnumLocationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationType[]
    notIn?: $Enums.LocationType[]
    not?: NestedEnumLocationTypeFilter<$PrismaModel> | $Enums.LocationType
  }

  export type InventoryLocationOrderByRelevanceInput = {
    fields: InventoryLocationOrderByRelevanceFieldEnum | InventoryLocationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InventoryLocationCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    machineId?: SortOrder
  }

  export type InventoryLocationAvgOrderByAggregateInput = {
    id?: SortOrder
    machineId?: SortOrder
  }

  export type InventoryLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    machineId?: SortOrder
  }

  export type InventoryLocationMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    type?: SortOrder
    machineId?: SortOrder
  }

  export type InventoryLocationSumOrderByAggregateInput = {
    id?: SortOrder
    machineId?: SortOrder
  }

  export type EnumLocationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationType | EnumLocationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationType[]
    notIn?: $Enums.LocationType[]
    not?: NestedEnumLocationTypeWithAggregatesFilter<$PrismaModel> | $Enums.LocationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationTypeFilter<$PrismaModel>
    _max?: NestedEnumLocationTypeFilter<$PrismaModel>
  }

  export type EnumTxnTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TxnType | EnumTxnTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxnType[]
    notIn?: $Enums.TxnType[]
    not?: NestedEnumTxnTypeFilter<$PrismaModel> | $Enums.TxnType
  }

  export type InventoryLocationScalarRelationFilter = {
    is?: InventoryLocationWhereInput
    isNot?: InventoryLocationWhereInput
  }

  export type ProNullableScalarRelationFilter = {
    is?: ProWhereInput | null
    isNot?: ProWhereInput | null
  }

  export type ProsesNullableScalarRelationFilter = {
    is?: ProsesWhereInput | null
    isNot?: ProsesWhereInput | null
  }

  export type ProductionReportNullableScalarRelationFilter = {
    is?: ProductionReportWhereInput | null
    isNot?: ProductionReportWhereInput | null
  }

  export type InventoryTxnOrderByRelevanceInput = {
    fields: InventoryTxnOrderByRelevanceFieldEnum | InventoryTxnOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InventoryTxnProductionReportIdItemIdTypeLocationIdCompoundUniqueInput = {
    productionReportId: string
    itemId: string
    type: $Enums.TxnType
    locationId: number
  }

  export type InventoryTxnCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    itemId?: SortOrder
    qty?: SortOrder
    itemMasterId?: SortOrder
    locationId?: SortOrder
    proId?: SortOrder
    prosesId?: SortOrder
    productionReportId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryTxnAvgOrderByAggregateInput = {
    qty?: SortOrder
    itemMasterId?: SortOrder
    locationId?: SortOrder
    proId?: SortOrder
    prosesId?: SortOrder
  }

  export type InventoryTxnMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    itemId?: SortOrder
    qty?: SortOrder
    itemMasterId?: SortOrder
    locationId?: SortOrder
    proId?: SortOrder
    prosesId?: SortOrder
    productionReportId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryTxnMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    date?: SortOrder
    type?: SortOrder
    itemId?: SortOrder
    qty?: SortOrder
    itemMasterId?: SortOrder
    locationId?: SortOrder
    proId?: SortOrder
    prosesId?: SortOrder
    productionReportId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryTxnSumOrderByAggregateInput = {
    qty?: SortOrder
    itemMasterId?: SortOrder
    locationId?: SortOrder
    proId?: SortOrder
    prosesId?: SortOrder
  }

  export type EnumTxnTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxnType | EnumTxnTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxnType[]
    notIn?: $Enums.TxnType[]
    not?: NestedEnumTxnTypeWithAggregatesFilter<$PrismaModel> | $Enums.TxnType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxnTypeFilter<$PrismaModel>
    _max?: NestedEnumTxnTypeFilter<$PrismaModel>
  }

  export type ProductionReportCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput> | ProductionReportCreateWithoutCreatedByInput[] | ProductionReportUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCreatedByInput | ProductionReportCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProductionReportCreateManyCreatedByInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ProductionReportCreateNestedManyWithoutCheckedByInput = {
    create?: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput> | ProductionReportCreateWithoutCheckedByInput[] | ProductionReportUncheckedCreateWithoutCheckedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCheckedByInput | ProductionReportCreateOrConnectWithoutCheckedByInput[]
    createMany?: ProductionReportCreateManyCheckedByInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ItemCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput> | ItemCreateWithoutCreatedByInput[] | ItemUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCreatedByInput | ItemCreateOrConnectWithoutCreatedByInput[]
    createMany?: ItemCreateManyCreatedByInputEnvelope
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
  }

  export type ProductionReportUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput> | ProductionReportCreateWithoutCreatedByInput[] | ProductionReportUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCreatedByInput | ProductionReportCreateOrConnectWithoutCreatedByInput[]
    createMany?: ProductionReportCreateManyCreatedByInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ProductionReportUncheckedCreateNestedManyWithoutCheckedByInput = {
    create?: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput> | ProductionReportCreateWithoutCheckedByInput[] | ProductionReportUncheckedCreateWithoutCheckedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCheckedByInput | ProductionReportCreateOrConnectWithoutCheckedByInput[]
    createMany?: ProductionReportCreateManyCheckedByInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type ItemUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput> | ItemCreateWithoutCreatedByInput[] | ItemUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCreatedByInput | ItemCreateOrConnectWithoutCreatedByInput[]
    createMany?: ItemCreateManyCreatedByInputEnvelope
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProductionReportUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput> | ProductionReportCreateWithoutCreatedByInput[] | ProductionReportUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCreatedByInput | ProductionReportCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutCreatedByInput | ProductionReportUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProductionReportCreateManyCreatedByInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutCreatedByInput | ProductionReportUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutCreatedByInput | ProductionReportUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ProductionReportUpdateManyWithoutCheckedByNestedInput = {
    create?: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput> | ProductionReportCreateWithoutCheckedByInput[] | ProductionReportUncheckedCreateWithoutCheckedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCheckedByInput | ProductionReportCreateOrConnectWithoutCheckedByInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutCheckedByInput | ProductionReportUpsertWithWhereUniqueWithoutCheckedByInput[]
    createMany?: ProductionReportCreateManyCheckedByInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutCheckedByInput | ProductionReportUpdateWithWhereUniqueWithoutCheckedByInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutCheckedByInput | ProductionReportUpdateManyWithWhereWithoutCheckedByInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ItemUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput> | ItemCreateWithoutCreatedByInput[] | ItemUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCreatedByInput | ItemCreateOrConnectWithoutCreatedByInput[]
    upsert?: ItemUpsertWithWhereUniqueWithoutCreatedByInput | ItemUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ItemCreateManyCreatedByInputEnvelope
    set?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    disconnect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    delete?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    update?: ItemUpdateWithWhereUniqueWithoutCreatedByInput | ItemUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ItemUpdateManyWithWhereWithoutCreatedByInput | ItemUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ItemScalarWhereInput | ItemScalarWhereInput[]
  }

  export type ProductionReportUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput> | ProductionReportCreateWithoutCreatedByInput[] | ProductionReportUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCreatedByInput | ProductionReportCreateOrConnectWithoutCreatedByInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutCreatedByInput | ProductionReportUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ProductionReportCreateManyCreatedByInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutCreatedByInput | ProductionReportUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutCreatedByInput | ProductionReportUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ProductionReportUncheckedUpdateManyWithoutCheckedByNestedInput = {
    create?: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput> | ProductionReportCreateWithoutCheckedByInput[] | ProductionReportUncheckedCreateWithoutCheckedByInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutCheckedByInput | ProductionReportCreateOrConnectWithoutCheckedByInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutCheckedByInput | ProductionReportUpsertWithWhereUniqueWithoutCheckedByInput[]
    createMany?: ProductionReportCreateManyCheckedByInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutCheckedByInput | ProductionReportUpdateWithWhereUniqueWithoutCheckedByInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutCheckedByInput | ProductionReportUpdateManyWithWhereWithoutCheckedByInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type ItemUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput> | ItemCreateWithoutCreatedByInput[] | ItemUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ItemCreateOrConnectWithoutCreatedByInput | ItemCreateOrConnectWithoutCreatedByInput[]
    upsert?: ItemUpsertWithWhereUniqueWithoutCreatedByInput | ItemUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ItemCreateManyCreatedByInputEnvelope
    set?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    disconnect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    delete?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    connect?: ItemWhereUniqueInput | ItemWhereUniqueInput[]
    update?: ItemUpdateWithWhereUniqueWithoutCreatedByInput | ItemUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ItemUpdateManyWithWhereWithoutCreatedByInput | ItemUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ItemScalarWhereInput | ItemScalarWhereInput[]
  }

  export type ProsesCreateNestedManyWithoutMachineInput = {
    create?: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput> | ProsesCreateWithoutMachineInput[] | ProsesUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutMachineInput | ProsesCreateOrConnectWithoutMachineInput[]
    createMany?: ProsesCreateManyMachineInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type InventoryLocationCreateNestedOneWithoutMachineInput = {
    create?: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutMachineInput
    connect?: InventoryLocationWhereUniqueInput
  }

  export type ProsesUncheckedCreateNestedManyWithoutMachineInput = {
    create?: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput> | ProsesCreateWithoutMachineInput[] | ProsesUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutMachineInput | ProsesCreateOrConnectWithoutMachineInput[]
    createMany?: ProsesCreateManyMachineInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type InventoryLocationUncheckedCreateNestedOneWithoutMachineInput = {
    create?: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutMachineInput
    connect?: InventoryLocationWhereUniqueInput
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

  export type ProsesUpdateManyWithoutMachineNestedInput = {
    create?: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput> | ProsesCreateWithoutMachineInput[] | ProsesUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutMachineInput | ProsesCreateOrConnectWithoutMachineInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutMachineInput | ProsesUpsertWithWhereUniqueWithoutMachineInput[]
    createMany?: ProsesCreateManyMachineInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutMachineInput | ProsesUpdateWithWhereUniqueWithoutMachineInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutMachineInput | ProsesUpdateManyWithWhereWithoutMachineInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type InventoryLocationUpdateOneWithoutMachineNestedInput = {
    create?: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutMachineInput
    upsert?: InventoryLocationUpsertWithoutMachineInput
    disconnect?: InventoryLocationWhereInput | boolean
    delete?: InventoryLocationWhereInput | boolean
    connect?: InventoryLocationWhereUniqueInput
    update?: XOR<XOR<InventoryLocationUpdateToOneWithWhereWithoutMachineInput, InventoryLocationUpdateWithoutMachineInput>, InventoryLocationUncheckedUpdateWithoutMachineInput>
  }

  export type ProsesUncheckedUpdateManyWithoutMachineNestedInput = {
    create?: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput> | ProsesCreateWithoutMachineInput[] | ProsesUncheckedCreateWithoutMachineInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutMachineInput | ProsesCreateOrConnectWithoutMachineInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutMachineInput | ProsesUpsertWithWhereUniqueWithoutMachineInput[]
    createMany?: ProsesCreateManyMachineInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutMachineInput | ProsesUpdateWithWhereUniqueWithoutMachineInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutMachineInput | ProsesUpdateManyWithWhereWithoutMachineInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type InventoryLocationUncheckedUpdateOneWithoutMachineNestedInput = {
    create?: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutMachineInput
    upsert?: InventoryLocationUpsertWithoutMachineInput
    disconnect?: InventoryLocationWhereInput | boolean
    delete?: InventoryLocationWhereInput | boolean
    connect?: InventoryLocationWhereUniqueInput
    update?: XOR<XOR<InventoryLocationUpdateToOneWithWhereWithoutMachineInput, InventoryLocationUpdateWithoutMachineInput>, InventoryLocationUncheckedUpdateWithoutMachineInput>
  }

  export type ProsesMaterialCreateNestedManyWithoutMaterialInput = {
    create?: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput> | ProsesMaterialCreateWithoutMaterialInput[] | ProsesMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutMaterialInput | ProsesMaterialCreateOrConnectWithoutMaterialInput[]
    createMany?: ProsesMaterialCreateManyMaterialInputEnvelope
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
  }

  export type ItemCreateNestedOneWithoutMaterialInput = {
    create?: XOR<ItemCreateWithoutMaterialInput, ItemUncheckedCreateWithoutMaterialInput>
    connectOrCreate?: ItemCreateOrConnectWithoutMaterialInput
    connect?: ItemWhereUniqueInput
  }

  export type ProsesMaterialUncheckedCreateNestedManyWithoutMaterialInput = {
    create?: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput> | ProsesMaterialCreateWithoutMaterialInput[] | ProsesMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutMaterialInput | ProsesMaterialCreateOrConnectWithoutMaterialInput[]
    createMany?: ProsesMaterialCreateManyMaterialInputEnvelope
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
  }

  export type EnumMaterialTypeFieldUpdateOperationsInput = {
    set?: $Enums.MaterialType
  }

  export type ProsesMaterialUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput> | ProsesMaterialCreateWithoutMaterialInput[] | ProsesMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutMaterialInput | ProsesMaterialCreateOrConnectWithoutMaterialInput[]
    upsert?: ProsesMaterialUpsertWithWhereUniqueWithoutMaterialInput | ProsesMaterialUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: ProsesMaterialCreateManyMaterialInputEnvelope
    set?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    disconnect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    delete?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    update?: ProsesMaterialUpdateWithWhereUniqueWithoutMaterialInput | ProsesMaterialUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: ProsesMaterialUpdateManyWithWhereWithoutMaterialInput | ProsesMaterialUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
  }

  export type ItemUpdateOneWithoutMaterialNestedInput = {
    create?: XOR<ItemCreateWithoutMaterialInput, ItemUncheckedCreateWithoutMaterialInput>
    connectOrCreate?: ItemCreateOrConnectWithoutMaterialInput
    upsert?: ItemUpsertWithoutMaterialInput
    disconnect?: ItemWhereInput | boolean
    delete?: ItemWhereInput | boolean
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutMaterialInput, ItemUpdateWithoutMaterialInput>, ItemUncheckedUpdateWithoutMaterialInput>
  }

  export type ProsesMaterialUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput> | ProsesMaterialCreateWithoutMaterialInput[] | ProsesMaterialUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutMaterialInput | ProsesMaterialCreateOrConnectWithoutMaterialInput[]
    upsert?: ProsesMaterialUpsertWithWhereUniqueWithoutMaterialInput | ProsesMaterialUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: ProsesMaterialCreateManyMaterialInputEnvelope
    set?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    disconnect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    delete?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    update?: ProsesMaterialUpdateWithWhereUniqueWithoutMaterialInput | ProsesMaterialUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: ProsesMaterialUpdateManyWithWhereWithoutMaterialInput | ProsesMaterialUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCreatedItemsInput = {
    create?: XOR<UserCreateWithoutCreatedItemsInput, UserUncheckedCreateWithoutCreatedItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedItemsInput
    connect?: UserWhereUniqueInput
  }

  export type InventoryTxnCreateNestedManyWithoutItemMasterInput = {
    create?: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput> | InventoryTxnCreateWithoutItemMasterInput[] | InventoryTxnUncheckedCreateWithoutItemMasterInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutItemMasterInput | InventoryTxnCreateOrConnectWithoutItemMasterInput[]
    createMany?: InventoryTxnCreateManyItemMasterInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type MaterialCreateNestedOneWithoutItemInput = {
    create?: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutItemInput
    connect?: MaterialWhereUniqueInput
  }

  export type ProCreateNestedManyWithoutFgItemInput = {
    create?: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput> | ProCreateWithoutFgItemInput[] | ProUncheckedCreateWithoutFgItemInput[]
    connectOrCreate?: ProCreateOrConnectWithoutFgItemInput | ProCreateOrConnectWithoutFgItemInput[]
    createMany?: ProCreateManyFgItemInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type ProsesCreateNestedManyWithoutOutputItemInput = {
    create?: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput> | ProsesCreateWithoutOutputItemInput[] | ProsesUncheckedCreateWithoutOutputItemInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutOutputItemInput | ProsesCreateOrConnectWithoutOutputItemInput[]
    createMany?: ProsesCreateManyOutputItemInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput = {
    create?: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput> | InventoryTxnCreateWithoutItemMasterInput[] | InventoryTxnUncheckedCreateWithoutItemMasterInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutItemMasterInput | InventoryTxnCreateOrConnectWithoutItemMasterInput[]
    createMany?: InventoryTxnCreateManyItemMasterInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type MaterialUncheckedCreateNestedOneWithoutItemInput = {
    create?: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutItemInput
    connect?: MaterialWhereUniqueInput
  }

  export type ProUncheckedCreateNestedManyWithoutFgItemInput = {
    create?: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput> | ProCreateWithoutFgItemInput[] | ProUncheckedCreateWithoutFgItemInput[]
    connectOrCreate?: ProCreateOrConnectWithoutFgItemInput | ProCreateOrConnectWithoutFgItemInput[]
    createMany?: ProCreateManyFgItemInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type ProsesUncheckedCreateNestedManyWithoutOutputItemInput = {
    create?: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput> | ProsesCreateWithoutOutputItemInput[] | ProsesUncheckedCreateWithoutOutputItemInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutOutputItemInput | ProsesCreateOrConnectWithoutOutputItemInput[]
    createMany?: ProsesCreateManyOutputItemInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type EnumItemKindFieldUpdateOperationsInput = {
    set?: $Enums.ItemKind
  }

  export type EnumItemStatusFieldUpdateOperationsInput = {
    set?: $Enums.ItemStatus
  }

  export type UserUpdateOneWithoutCreatedItemsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedItemsInput, UserUncheckedCreateWithoutCreatedItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedItemsInput
    upsert?: UserUpsertWithoutCreatedItemsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedItemsInput, UserUpdateWithoutCreatedItemsInput>, UserUncheckedUpdateWithoutCreatedItemsInput>
  }

  export type InventoryTxnUpdateManyWithoutItemMasterNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput> | InventoryTxnCreateWithoutItemMasterInput[] | InventoryTxnUncheckedCreateWithoutItemMasterInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutItemMasterInput | InventoryTxnCreateOrConnectWithoutItemMasterInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutItemMasterInput | InventoryTxnUpsertWithWhereUniqueWithoutItemMasterInput[]
    createMany?: InventoryTxnCreateManyItemMasterInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutItemMasterInput | InventoryTxnUpdateWithWhereUniqueWithoutItemMasterInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutItemMasterInput | InventoryTxnUpdateManyWithWhereWithoutItemMasterInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type MaterialUpdateOneWithoutItemNestedInput = {
    create?: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutItemInput
    upsert?: MaterialUpsertWithoutItemInput
    disconnect?: MaterialWhereInput | boolean
    delete?: MaterialWhereInput | boolean
    connect?: MaterialWhereUniqueInput
    update?: XOR<XOR<MaterialUpdateToOneWithWhereWithoutItemInput, MaterialUpdateWithoutItemInput>, MaterialUncheckedUpdateWithoutItemInput>
  }

  export type ProUpdateManyWithoutFgItemNestedInput = {
    create?: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput> | ProCreateWithoutFgItemInput[] | ProUncheckedCreateWithoutFgItemInput[]
    connectOrCreate?: ProCreateOrConnectWithoutFgItemInput | ProCreateOrConnectWithoutFgItemInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutFgItemInput | ProUpsertWithWhereUniqueWithoutFgItemInput[]
    createMany?: ProCreateManyFgItemInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutFgItemInput | ProUpdateWithWhereUniqueWithoutFgItemInput[]
    updateMany?: ProUpdateManyWithWhereWithoutFgItemInput | ProUpdateManyWithWhereWithoutFgItemInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProsesUpdateManyWithoutOutputItemNestedInput = {
    create?: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput> | ProsesCreateWithoutOutputItemInput[] | ProsesUncheckedCreateWithoutOutputItemInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutOutputItemInput | ProsesCreateOrConnectWithoutOutputItemInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutOutputItemInput | ProsesUpsertWithWhereUniqueWithoutOutputItemInput[]
    createMany?: ProsesCreateManyOutputItemInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutOutputItemInput | ProsesUpdateWithWhereUniqueWithoutOutputItemInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutOutputItemInput | ProsesUpdateManyWithWhereWithoutOutputItemInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput> | InventoryTxnCreateWithoutItemMasterInput[] | InventoryTxnUncheckedCreateWithoutItemMasterInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutItemMasterInput | InventoryTxnCreateOrConnectWithoutItemMasterInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutItemMasterInput | InventoryTxnUpsertWithWhereUniqueWithoutItemMasterInput[]
    createMany?: InventoryTxnCreateManyItemMasterInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutItemMasterInput | InventoryTxnUpdateWithWhereUniqueWithoutItemMasterInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutItemMasterInput | InventoryTxnUpdateManyWithWhereWithoutItemMasterInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type MaterialUncheckedUpdateOneWithoutItemNestedInput = {
    create?: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutItemInput
    upsert?: MaterialUpsertWithoutItemInput
    disconnect?: MaterialWhereInput | boolean
    delete?: MaterialWhereInput | boolean
    connect?: MaterialWhereUniqueInput
    update?: XOR<XOR<MaterialUpdateToOneWithWhereWithoutItemInput, MaterialUpdateWithoutItemInput>, MaterialUncheckedUpdateWithoutItemInput>
  }

  export type ProUncheckedUpdateManyWithoutFgItemNestedInput = {
    create?: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput> | ProCreateWithoutFgItemInput[] | ProUncheckedCreateWithoutFgItemInput[]
    connectOrCreate?: ProCreateOrConnectWithoutFgItemInput | ProCreateOrConnectWithoutFgItemInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutFgItemInput | ProUpsertWithWhereUniqueWithoutFgItemInput[]
    createMany?: ProCreateManyFgItemInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutFgItemInput | ProUpdateWithWhereUniqueWithoutFgItemInput[]
    updateMany?: ProUpdateManyWithWhereWithoutFgItemInput | ProUpdateManyWithWhereWithoutFgItemInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProsesUncheckedUpdateManyWithoutOutputItemNestedInput = {
    create?: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput> | ProsesCreateWithoutOutputItemInput[] | ProsesUncheckedCreateWithoutOutputItemInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutOutputItemInput | ProsesCreateOrConnectWithoutOutputItemInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutOutputItemInput | ProsesUpsertWithWhereUniqueWithoutOutputItemInput[]
    createMany?: ProsesCreateManyOutputItemInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutOutputItemInput | ProsesUpdateWithWhereUniqueWithoutOutputItemInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutOutputItemInput | ProsesUpdateManyWithWhereWithoutOutputItemInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type ProCreateNestedManyWithoutProPrefixInput = {
    create?: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput> | ProCreateWithoutProPrefixInput[] | ProUncheckedCreateWithoutProPrefixInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProPrefixInput | ProCreateOrConnectWithoutProPrefixInput[]
    createMany?: ProCreateManyProPrefixInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type ProUncheckedCreateNestedManyWithoutProPrefixInput = {
    create?: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput> | ProCreateWithoutProPrefixInput[] | ProUncheckedCreateWithoutProPrefixInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProPrefixInput | ProCreateOrConnectWithoutProPrefixInput[]
    createMany?: ProCreateManyProPrefixInputEnvelope
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
  }

  export type EnumProTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProType
  }

  export type ProUpdateManyWithoutProPrefixNestedInput = {
    create?: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput> | ProCreateWithoutProPrefixInput[] | ProUncheckedCreateWithoutProPrefixInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProPrefixInput | ProCreateOrConnectWithoutProPrefixInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutProPrefixInput | ProUpsertWithWhereUniqueWithoutProPrefixInput[]
    createMany?: ProCreateManyProPrefixInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutProPrefixInput | ProUpdateWithWhereUniqueWithoutProPrefixInput[]
    updateMany?: ProUpdateManyWithWhereWithoutProPrefixInput | ProUpdateManyWithWhereWithoutProPrefixInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProUncheckedUpdateManyWithoutProPrefixNestedInput = {
    create?: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput> | ProCreateWithoutProPrefixInput[] | ProUncheckedCreateWithoutProPrefixInput[]
    connectOrCreate?: ProCreateOrConnectWithoutProPrefixInput | ProCreateOrConnectWithoutProPrefixInput[]
    upsert?: ProUpsertWithWhereUniqueWithoutProPrefixInput | ProUpsertWithWhereUniqueWithoutProPrefixInput[]
    createMany?: ProCreateManyProPrefixInputEnvelope
    set?: ProWhereUniqueInput | ProWhereUniqueInput[]
    disconnect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    delete?: ProWhereUniqueInput | ProWhereUniqueInput[]
    connect?: ProWhereUniqueInput | ProWhereUniqueInput[]
    update?: ProUpdateWithWhereUniqueWithoutProPrefixInput | ProUpdateWithWhereUniqueWithoutProPrefixInput[]
    updateMany?: ProUpdateManyWithWhereWithoutProPrefixInput | ProUpdateManyWithWhereWithoutProPrefixInput[]
    deleteMany?: ProScalarWhereInput | ProScalarWhereInput[]
  }

  export type ProPrefixCreateNestedOneWithoutProsInput = {
    create?: XOR<ProPrefixCreateWithoutProsInput, ProPrefixUncheckedCreateWithoutProsInput>
    connectOrCreate?: ProPrefixCreateOrConnectWithoutProsInput
    connect?: ProPrefixWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutFgProsInput = {
    create?: XOR<ItemCreateWithoutFgProsInput, ItemUncheckedCreateWithoutFgProsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutFgProsInput
    connect?: ItemWhereUniqueInput
  }

  export type ProsesCreateNestedManyWithoutProInput = {
    create?: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput> | ProsesCreateWithoutProInput[] | ProsesUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutProInput | ProsesCreateOrConnectWithoutProInput[]
    createMany?: ProsesCreateManyProInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type InventoryTxnCreateNestedManyWithoutProInput = {
    create?: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput> | InventoryTxnCreateWithoutProInput[] | InventoryTxnUncheckedCreateWithoutProInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProInput | InventoryTxnCreateOrConnectWithoutProInput[]
    createMany?: InventoryTxnCreateManyProInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type ProsesUncheckedCreateNestedManyWithoutProInput = {
    create?: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput> | ProsesCreateWithoutProInput[] | ProsesUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutProInput | ProsesCreateOrConnectWithoutProInput[]
    createMany?: ProsesCreateManyProInputEnvelope
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
  }

  export type InventoryTxnUncheckedCreateNestedManyWithoutProInput = {
    create?: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput> | InventoryTxnCreateWithoutProInput[] | InventoryTxnUncheckedCreateWithoutProInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProInput | InventoryTxnCreateOrConnectWithoutProInput[]
    createMany?: InventoryTxnCreateManyProInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
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

  export type ProPrefixUpdateOneWithoutProsNestedInput = {
    create?: XOR<ProPrefixCreateWithoutProsInput, ProPrefixUncheckedCreateWithoutProsInput>
    connectOrCreate?: ProPrefixCreateOrConnectWithoutProsInput
    upsert?: ProPrefixUpsertWithoutProsInput
    disconnect?: ProPrefixWhereInput | boolean
    delete?: ProPrefixWhereInput | boolean
    connect?: ProPrefixWhereUniqueInput
    update?: XOR<XOR<ProPrefixUpdateToOneWithWhereWithoutProsInput, ProPrefixUpdateWithoutProsInput>, ProPrefixUncheckedUpdateWithoutProsInput>
  }

  export type ItemUpdateOneWithoutFgProsNestedInput = {
    create?: XOR<ItemCreateWithoutFgProsInput, ItemUncheckedCreateWithoutFgProsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutFgProsInput
    upsert?: ItemUpsertWithoutFgProsInput
    disconnect?: ItemWhereInput | boolean
    delete?: ItemWhereInput | boolean
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutFgProsInput, ItemUpdateWithoutFgProsInput>, ItemUncheckedUpdateWithoutFgProsInput>
  }

  export type ProsesUpdateManyWithoutProNestedInput = {
    create?: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput> | ProsesCreateWithoutProInput[] | ProsesUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutProInput | ProsesCreateOrConnectWithoutProInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutProInput | ProsesUpsertWithWhereUniqueWithoutProInput[]
    createMany?: ProsesCreateManyProInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutProInput | ProsesUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutProInput | ProsesUpdateManyWithWhereWithoutProInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type InventoryTxnUpdateManyWithoutProNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput> | InventoryTxnCreateWithoutProInput[] | InventoryTxnUncheckedCreateWithoutProInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProInput | InventoryTxnCreateOrConnectWithoutProInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProInput | InventoryTxnUpsertWithWhereUniqueWithoutProInput[]
    createMany?: InventoryTxnCreateManyProInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProInput | InventoryTxnUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProInput | InventoryTxnUpdateManyWithWhereWithoutProInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type ProsesUncheckedUpdateManyWithoutProNestedInput = {
    create?: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput> | ProsesCreateWithoutProInput[] | ProsesUncheckedCreateWithoutProInput[]
    connectOrCreate?: ProsesCreateOrConnectWithoutProInput | ProsesCreateOrConnectWithoutProInput[]
    upsert?: ProsesUpsertWithWhereUniqueWithoutProInput | ProsesUpsertWithWhereUniqueWithoutProInput[]
    createMany?: ProsesCreateManyProInputEnvelope
    set?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    disconnect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    delete?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    connect?: ProsesWhereUniqueInput | ProsesWhereUniqueInput[]
    update?: ProsesUpdateWithWhereUniqueWithoutProInput | ProsesUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: ProsesUpdateManyWithWhereWithoutProInput | ProsesUpdateManyWithWhereWithoutProInput[]
    deleteMany?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput> | InventoryTxnCreateWithoutProInput[] | InventoryTxnUncheckedCreateWithoutProInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProInput | InventoryTxnCreateOrConnectWithoutProInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProInput | InventoryTxnUpsertWithWhereUniqueWithoutProInput[]
    createMany?: InventoryTxnCreateManyProInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProInput | InventoryTxnUpdateWithWhereUniqueWithoutProInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProInput | InventoryTxnUpdateManyWithWhereWithoutProInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type ProCreateNestedOneWithoutProsesInput = {
    create?: XOR<ProCreateWithoutProsesInput, ProUncheckedCreateWithoutProsesInput>
    connectOrCreate?: ProCreateOrConnectWithoutProsesInput
    connect?: ProWhereUniqueInput
  }

  export type MachineCreateNestedOneWithoutProsesInput = {
    create?: XOR<MachineCreateWithoutProsesInput, MachineUncheckedCreateWithoutProsesInput>
    connectOrCreate?: MachineCreateOrConnectWithoutProsesInput
    connect?: MachineWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutOutputProsesInput = {
    create?: XOR<ItemCreateWithoutOutputProsesInput, ItemUncheckedCreateWithoutOutputProsesInput>
    connectOrCreate?: ItemCreateOrConnectWithoutOutputProsesInput
    connect?: ItemWhereUniqueInput
  }

  export type ProsesMaterialCreateNestedManyWithoutProsesInput = {
    create?: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput> | ProsesMaterialCreateWithoutProsesInput[] | ProsesMaterialUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutProsesInput | ProsesMaterialCreateOrConnectWithoutProsesInput[]
    createMany?: ProsesMaterialCreateManyProsesInputEnvelope
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
  }

  export type ProductionReportCreateNestedManyWithoutProsesInput = {
    create?: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput> | ProductionReportCreateWithoutProsesInput[] | ProductionReportUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutProsesInput | ProductionReportCreateOrConnectWithoutProsesInput[]
    createMany?: ProductionReportCreateManyProsesInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type InventoryTxnCreateNestedManyWithoutProsesInput = {
    create?: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput> | InventoryTxnCreateWithoutProsesInput[] | InventoryTxnUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProsesInput | InventoryTxnCreateOrConnectWithoutProsesInput[]
    createMany?: InventoryTxnCreateManyProsesInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput = {
    create?: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput> | ProsesMaterialCreateWithoutProsesInput[] | ProsesMaterialUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutProsesInput | ProsesMaterialCreateOrConnectWithoutProsesInput[]
    createMany?: ProsesMaterialCreateManyProsesInputEnvelope
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
  }

  export type ProductionReportUncheckedCreateNestedManyWithoutProsesInput = {
    create?: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput> | ProductionReportCreateWithoutProsesInput[] | ProductionReportUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutProsesInput | ProductionReportCreateOrConnectWithoutProsesInput[]
    createMany?: ProductionReportCreateManyProsesInputEnvelope
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
  }

  export type InventoryTxnUncheckedCreateNestedManyWithoutProsesInput = {
    create?: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput> | InventoryTxnCreateWithoutProsesInput[] | InventoryTxnUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProsesInput | InventoryTxnCreateOrConnectWithoutProsesInput[]
    createMany?: InventoryTxnCreateManyProsesInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type ProUpdateOneRequiredWithoutProsesNestedInput = {
    create?: XOR<ProCreateWithoutProsesInput, ProUncheckedCreateWithoutProsesInput>
    connectOrCreate?: ProCreateOrConnectWithoutProsesInput
    upsert?: ProUpsertWithoutProsesInput
    connect?: ProWhereUniqueInput
    update?: XOR<XOR<ProUpdateToOneWithWhereWithoutProsesInput, ProUpdateWithoutProsesInput>, ProUncheckedUpdateWithoutProsesInput>
  }

  export type MachineUpdateOneWithoutProsesNestedInput = {
    create?: XOR<MachineCreateWithoutProsesInput, MachineUncheckedCreateWithoutProsesInput>
    connectOrCreate?: MachineCreateOrConnectWithoutProsesInput
    upsert?: MachineUpsertWithoutProsesInput
    disconnect?: MachineWhereInput | boolean
    delete?: MachineWhereInput | boolean
    connect?: MachineWhereUniqueInput
    update?: XOR<XOR<MachineUpdateToOneWithWhereWithoutProsesInput, MachineUpdateWithoutProsesInput>, MachineUncheckedUpdateWithoutProsesInput>
  }

  export type ItemUpdateOneWithoutOutputProsesNestedInput = {
    create?: XOR<ItemCreateWithoutOutputProsesInput, ItemUncheckedCreateWithoutOutputProsesInput>
    connectOrCreate?: ItemCreateOrConnectWithoutOutputProsesInput
    upsert?: ItemUpsertWithoutOutputProsesInput
    disconnect?: ItemWhereInput | boolean
    delete?: ItemWhereInput | boolean
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutOutputProsesInput, ItemUpdateWithoutOutputProsesInput>, ItemUncheckedUpdateWithoutOutputProsesInput>
  }

  export type ProsesMaterialUpdateManyWithoutProsesNestedInput = {
    create?: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput> | ProsesMaterialCreateWithoutProsesInput[] | ProsesMaterialUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutProsesInput | ProsesMaterialCreateOrConnectWithoutProsesInput[]
    upsert?: ProsesMaterialUpsertWithWhereUniqueWithoutProsesInput | ProsesMaterialUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: ProsesMaterialCreateManyProsesInputEnvelope
    set?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    disconnect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    delete?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    update?: ProsesMaterialUpdateWithWhereUniqueWithoutProsesInput | ProsesMaterialUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: ProsesMaterialUpdateManyWithWhereWithoutProsesInput | ProsesMaterialUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
  }

  export type ProductionReportUpdateManyWithoutProsesNestedInput = {
    create?: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput> | ProductionReportCreateWithoutProsesInput[] | ProductionReportUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutProsesInput | ProductionReportCreateOrConnectWithoutProsesInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutProsesInput | ProductionReportUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: ProductionReportCreateManyProsesInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutProsesInput | ProductionReportUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutProsesInput | ProductionReportUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type InventoryTxnUpdateManyWithoutProsesNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput> | InventoryTxnCreateWithoutProsesInput[] | InventoryTxnUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProsesInput | InventoryTxnCreateOrConnectWithoutProsesInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProsesInput | InventoryTxnUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: InventoryTxnCreateManyProsesInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProsesInput | InventoryTxnUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProsesInput | InventoryTxnUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput = {
    create?: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput> | ProsesMaterialCreateWithoutProsesInput[] | ProsesMaterialUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProsesMaterialCreateOrConnectWithoutProsesInput | ProsesMaterialCreateOrConnectWithoutProsesInput[]
    upsert?: ProsesMaterialUpsertWithWhereUniqueWithoutProsesInput | ProsesMaterialUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: ProsesMaterialCreateManyProsesInputEnvelope
    set?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    disconnect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    delete?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    connect?: ProsesMaterialWhereUniqueInput | ProsesMaterialWhereUniqueInput[]
    update?: ProsesMaterialUpdateWithWhereUniqueWithoutProsesInput | ProsesMaterialUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: ProsesMaterialUpdateManyWithWhereWithoutProsesInput | ProsesMaterialUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
  }

  export type ProductionReportUncheckedUpdateManyWithoutProsesNestedInput = {
    create?: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput> | ProductionReportCreateWithoutProsesInput[] | ProductionReportUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: ProductionReportCreateOrConnectWithoutProsesInput | ProductionReportCreateOrConnectWithoutProsesInput[]
    upsert?: ProductionReportUpsertWithWhereUniqueWithoutProsesInput | ProductionReportUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: ProductionReportCreateManyProsesInputEnvelope
    set?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    disconnect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    delete?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    connect?: ProductionReportWhereUniqueInput | ProductionReportWhereUniqueInput[]
    update?: ProductionReportUpdateWithWhereUniqueWithoutProsesInput | ProductionReportUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: ProductionReportUpdateManyWithWhereWithoutProsesInput | ProductionReportUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput> | InventoryTxnCreateWithoutProsesInput[] | InventoryTxnUncheckedCreateWithoutProsesInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProsesInput | InventoryTxnCreateOrConnectWithoutProsesInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProsesInput | InventoryTxnUpsertWithWhereUniqueWithoutProsesInput[]
    createMany?: InventoryTxnCreateManyProsesInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProsesInput | InventoryTxnUpdateWithWhereUniqueWithoutProsesInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProsesInput | InventoryTxnUpdateManyWithWhereWithoutProsesInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type ProsesCreateNestedOneWithoutMaterialsInput = {
    create?: XOR<ProsesCreateWithoutMaterialsInput, ProsesUncheckedCreateWithoutMaterialsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutMaterialsInput
    connect?: ProsesWhereUniqueInput
  }

  export type MaterialCreateNestedOneWithoutProsesMaterialsInput = {
    create?: XOR<MaterialCreateWithoutProsesMaterialsInput, MaterialUncheckedCreateWithoutProsesMaterialsInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutProsesMaterialsInput
    connect?: MaterialWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ProsesUpdateOneRequiredWithoutMaterialsNestedInput = {
    create?: XOR<ProsesCreateWithoutMaterialsInput, ProsesUncheckedCreateWithoutMaterialsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutMaterialsInput
    upsert?: ProsesUpsertWithoutMaterialsInput
    connect?: ProsesWhereUniqueInput
    update?: XOR<XOR<ProsesUpdateToOneWithWhereWithoutMaterialsInput, ProsesUpdateWithoutMaterialsInput>, ProsesUncheckedUpdateWithoutMaterialsInput>
  }

  export type MaterialUpdateOneRequiredWithoutProsesMaterialsNestedInput = {
    create?: XOR<MaterialCreateWithoutProsesMaterialsInput, MaterialUncheckedCreateWithoutProsesMaterialsInput>
    connectOrCreate?: MaterialCreateOrConnectWithoutProsesMaterialsInput
    upsert?: MaterialUpsertWithoutProsesMaterialsInput
    connect?: MaterialWhereUniqueInput
    update?: XOR<XOR<MaterialUpdateToOneWithWhereWithoutProsesMaterialsInput, MaterialUpdateWithoutProsesMaterialsInput>, MaterialUncheckedUpdateWithoutProsesMaterialsInput>
  }

  export type ProsesCreateNestedOneWithoutProductionReportsInput = {
    create?: XOR<ProsesCreateWithoutProductionReportsInput, ProsesUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutProductionReportsInput
    connect?: ProsesWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProductionReportsInput = {
    create?: XOR<UserCreateWithoutProductionReportsInput, UserUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductionReportsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCheckedProductionReportsInput = {
    create?: XOR<UserCreateWithoutCheckedProductionReportsInput, UserUncheckedCreateWithoutCheckedProductionReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckedProductionReportsInput
    connect?: UserWhereUniqueInput
  }

  export type InventoryTxnCreateNestedManyWithoutProductionReportInput = {
    create?: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput> | InventoryTxnCreateWithoutProductionReportInput[] | InventoryTxnUncheckedCreateWithoutProductionReportInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProductionReportInput | InventoryTxnCreateOrConnectWithoutProductionReportInput[]
    createMany?: InventoryTxnCreateManyProductionReportInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type InventoryTxnUncheckedCreateNestedManyWithoutProductionReportInput = {
    create?: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput> | InventoryTxnCreateWithoutProductionReportInput[] | InventoryTxnUncheckedCreateWithoutProductionReportInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProductionReportInput | InventoryTxnCreateOrConnectWithoutProductionReportInput[]
    createMany?: InventoryTxnCreateManyProductionReportInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type EnumLphTypeFieldUpdateOperationsInput = {
    set?: $Enums.LphType
  }

  export type EnumReportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReportStatus
  }

  export type ProsesUpdateOneRequiredWithoutProductionReportsNestedInput = {
    create?: XOR<ProsesCreateWithoutProductionReportsInput, ProsesUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutProductionReportsInput
    upsert?: ProsesUpsertWithoutProductionReportsInput
    connect?: ProsesWhereUniqueInput
    update?: XOR<XOR<ProsesUpdateToOneWithWhereWithoutProductionReportsInput, ProsesUpdateWithoutProductionReportsInput>, ProsesUncheckedUpdateWithoutProductionReportsInput>
  }

  export type UserUpdateOneWithoutProductionReportsNestedInput = {
    create?: XOR<UserCreateWithoutProductionReportsInput, UserUncheckedCreateWithoutProductionReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductionReportsInput
    upsert?: UserUpsertWithoutProductionReportsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProductionReportsInput, UserUpdateWithoutProductionReportsInput>, UserUncheckedUpdateWithoutProductionReportsInput>
  }

  export type UserUpdateOneWithoutCheckedProductionReportsNestedInput = {
    create?: XOR<UserCreateWithoutCheckedProductionReportsInput, UserUncheckedCreateWithoutCheckedProductionReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCheckedProductionReportsInput
    upsert?: UserUpsertWithoutCheckedProductionReportsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCheckedProductionReportsInput, UserUpdateWithoutCheckedProductionReportsInput>, UserUncheckedUpdateWithoutCheckedProductionReportsInput>
  }

  export type InventoryTxnUpdateManyWithoutProductionReportNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput> | InventoryTxnCreateWithoutProductionReportInput[] | InventoryTxnUncheckedCreateWithoutProductionReportInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProductionReportInput | InventoryTxnCreateOrConnectWithoutProductionReportInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProductionReportInput | InventoryTxnUpsertWithWhereUniqueWithoutProductionReportInput[]
    createMany?: InventoryTxnCreateManyProductionReportInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProductionReportInput | InventoryTxnUpdateWithWhereUniqueWithoutProductionReportInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProductionReportInput | InventoryTxnUpdateManyWithWhereWithoutProductionReportInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProductionReportNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput> | InventoryTxnCreateWithoutProductionReportInput[] | InventoryTxnUncheckedCreateWithoutProductionReportInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutProductionReportInput | InventoryTxnCreateOrConnectWithoutProductionReportInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutProductionReportInput | InventoryTxnUpsertWithWhereUniqueWithoutProductionReportInput[]
    createMany?: InventoryTxnCreateManyProductionReportInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutProductionReportInput | InventoryTxnUpdateWithWhereUniqueWithoutProductionReportInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutProductionReportInput | InventoryTxnUpdateManyWithWhereWithoutProductionReportInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type MachineCreateNestedOneWithoutLocationInput = {
    create?: XOR<MachineCreateWithoutLocationInput, MachineUncheckedCreateWithoutLocationInput>
    connectOrCreate?: MachineCreateOrConnectWithoutLocationInput
    connect?: MachineWhereUniqueInput
  }

  export type InventoryTxnCreateNestedManyWithoutLocationInput = {
    create?: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput> | InventoryTxnCreateWithoutLocationInput[] | InventoryTxnUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutLocationInput | InventoryTxnCreateOrConnectWithoutLocationInput[]
    createMany?: InventoryTxnCreateManyLocationInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type InventoryTxnUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput> | InventoryTxnCreateWithoutLocationInput[] | InventoryTxnUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutLocationInput | InventoryTxnCreateOrConnectWithoutLocationInput[]
    createMany?: InventoryTxnCreateManyLocationInputEnvelope
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
  }

  export type EnumLocationTypeFieldUpdateOperationsInput = {
    set?: $Enums.LocationType
  }

  export type MachineUpdateOneWithoutLocationNestedInput = {
    create?: XOR<MachineCreateWithoutLocationInput, MachineUncheckedCreateWithoutLocationInput>
    connectOrCreate?: MachineCreateOrConnectWithoutLocationInput
    upsert?: MachineUpsertWithoutLocationInput
    disconnect?: MachineWhereInput | boolean
    delete?: MachineWhereInput | boolean
    connect?: MachineWhereUniqueInput
    update?: XOR<XOR<MachineUpdateToOneWithWhereWithoutLocationInput, MachineUpdateWithoutLocationInput>, MachineUncheckedUpdateWithoutLocationInput>
  }

  export type InventoryTxnUpdateManyWithoutLocationNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput> | InventoryTxnCreateWithoutLocationInput[] | InventoryTxnUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutLocationInput | InventoryTxnCreateOrConnectWithoutLocationInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutLocationInput | InventoryTxnUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: InventoryTxnCreateManyLocationInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutLocationInput | InventoryTxnUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutLocationInput | InventoryTxnUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type InventoryTxnUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput> | InventoryTxnCreateWithoutLocationInput[] | InventoryTxnUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: InventoryTxnCreateOrConnectWithoutLocationInput | InventoryTxnCreateOrConnectWithoutLocationInput[]
    upsert?: InventoryTxnUpsertWithWhereUniqueWithoutLocationInput | InventoryTxnUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: InventoryTxnCreateManyLocationInputEnvelope
    set?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    disconnect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    delete?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    connect?: InventoryTxnWhereUniqueInput | InventoryTxnWhereUniqueInput[]
    update?: InventoryTxnUpdateWithWhereUniqueWithoutLocationInput | InventoryTxnUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: InventoryTxnUpdateManyWithWhereWithoutLocationInput | InventoryTxnUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
  }

  export type ItemCreateNestedOneWithoutInventoryTxnsInput = {
    create?: XOR<ItemCreateWithoutInventoryTxnsInput, ItemUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutInventoryTxnsInput
    connect?: ItemWhereUniqueInput
  }

  export type InventoryLocationCreateNestedOneWithoutTxnsInput = {
    create?: XOR<InventoryLocationCreateWithoutTxnsInput, InventoryLocationUncheckedCreateWithoutTxnsInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutTxnsInput
    connect?: InventoryLocationWhereUniqueInput
  }

  export type ProCreateNestedOneWithoutInventoryTxnsInput = {
    create?: XOR<ProCreateWithoutInventoryTxnsInput, ProUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProCreateOrConnectWithoutInventoryTxnsInput
    connect?: ProWhereUniqueInput
  }

  export type ProsesCreateNestedOneWithoutInventoryTxnsInput = {
    create?: XOR<ProsesCreateWithoutInventoryTxnsInput, ProsesUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutInventoryTxnsInput
    connect?: ProsesWhereUniqueInput
  }

  export type ProductionReportCreateNestedOneWithoutInventoryTxnsInput = {
    create?: XOR<ProductionReportCreateWithoutInventoryTxnsInput, ProductionReportUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProductionReportCreateOrConnectWithoutInventoryTxnsInput
    connect?: ProductionReportWhereUniqueInput
  }

  export type EnumTxnTypeFieldUpdateOperationsInput = {
    set?: $Enums.TxnType
  }

  export type ItemUpdateOneWithoutInventoryTxnsNestedInput = {
    create?: XOR<ItemCreateWithoutInventoryTxnsInput, ItemUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutInventoryTxnsInput
    upsert?: ItemUpsertWithoutInventoryTxnsInput
    disconnect?: ItemWhereInput | boolean
    delete?: ItemWhereInput | boolean
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutInventoryTxnsInput, ItemUpdateWithoutInventoryTxnsInput>, ItemUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput = {
    create?: XOR<InventoryLocationCreateWithoutTxnsInput, InventoryLocationUncheckedCreateWithoutTxnsInput>
    connectOrCreate?: InventoryLocationCreateOrConnectWithoutTxnsInput
    upsert?: InventoryLocationUpsertWithoutTxnsInput
    connect?: InventoryLocationWhereUniqueInput
    update?: XOR<XOR<InventoryLocationUpdateToOneWithWhereWithoutTxnsInput, InventoryLocationUpdateWithoutTxnsInput>, InventoryLocationUncheckedUpdateWithoutTxnsInput>
  }

  export type ProUpdateOneWithoutInventoryTxnsNestedInput = {
    create?: XOR<ProCreateWithoutInventoryTxnsInput, ProUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProCreateOrConnectWithoutInventoryTxnsInput
    upsert?: ProUpsertWithoutInventoryTxnsInput
    disconnect?: ProWhereInput | boolean
    delete?: ProWhereInput | boolean
    connect?: ProWhereUniqueInput
    update?: XOR<XOR<ProUpdateToOneWithWhereWithoutInventoryTxnsInput, ProUpdateWithoutInventoryTxnsInput>, ProUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ProsesUpdateOneWithoutInventoryTxnsNestedInput = {
    create?: XOR<ProsesCreateWithoutInventoryTxnsInput, ProsesUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProsesCreateOrConnectWithoutInventoryTxnsInput
    upsert?: ProsesUpsertWithoutInventoryTxnsInput
    disconnect?: ProsesWhereInput | boolean
    delete?: ProsesWhereInput | boolean
    connect?: ProsesWhereUniqueInput
    update?: XOR<XOR<ProsesUpdateToOneWithWhereWithoutInventoryTxnsInput, ProsesUpdateWithoutInventoryTxnsInput>, ProsesUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ProductionReportUpdateOneWithoutInventoryTxnsNestedInput = {
    create?: XOR<ProductionReportCreateWithoutInventoryTxnsInput, ProductionReportUncheckedCreateWithoutInventoryTxnsInput>
    connectOrCreate?: ProductionReportCreateOrConnectWithoutInventoryTxnsInput
    upsert?: ProductionReportUpsertWithoutInventoryTxnsInput
    disconnect?: ProductionReportWhereInput | boolean
    delete?: ProductionReportWhereInput | boolean
    connect?: ProductionReportWhereUniqueInput
    update?: XOR<XOR<ProductionReportUpdateToOneWithWhereWithoutInventoryTxnsInput, ProductionReportUpdateWithoutInventoryTxnsInput>, ProductionReportUncheckedUpdateWithoutInventoryTxnsInput>
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

  export type NestedEnumMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaterialType[]
    notIn?: $Enums.MaterialType[]
    not?: NestedEnumMaterialTypeFilter<$PrismaModel> | $Enums.MaterialType
  }

  export type NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaterialType | EnumMaterialTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaterialType[]
    notIn?: $Enums.MaterialType[]
    not?: NestedEnumMaterialTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaterialType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaterialTypeFilter<$PrismaModel>
    _max?: NestedEnumMaterialTypeFilter<$PrismaModel>
  }

  export type NestedEnumItemKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemKind | EnumItemKindFieldRefInput<$PrismaModel>
    in?: $Enums.ItemKind[]
    notIn?: $Enums.ItemKind[]
    not?: NestedEnumItemKindFilter<$PrismaModel> | $Enums.ItemKind
  }

  export type NestedEnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[]
    notIn?: $Enums.ItemStatus[]
    not?: NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus
  }

  export type NestedEnumItemKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemKind | EnumItemKindFieldRefInput<$PrismaModel>
    in?: $Enums.ItemKind[]
    notIn?: $Enums.ItemKind[]
    not?: NestedEnumItemKindWithAggregatesFilter<$PrismaModel> | $Enums.ItemKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemKindFilter<$PrismaModel>
    _max?: NestedEnumItemKindFilter<$PrismaModel>
  }

  export type NestedEnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | EnumItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ItemStatus[]
    notIn?: $Enums.ItemStatus[]
    not?: NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemStatusFilter<$PrismaModel>
    _max?: NestedEnumItemStatusFilter<$PrismaModel>
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

  export type NestedEnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[]
    notIn?: $Enums.ReportStatus[]
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
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

  export type NestedEnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[]
    notIn?: $Enums.ReportStatus[]
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type NestedEnumLocationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationType | EnumLocationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationType[]
    notIn?: $Enums.LocationType[]
    not?: NestedEnumLocationTypeFilter<$PrismaModel> | $Enums.LocationType
  }

  export type NestedEnumLocationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationType | EnumLocationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LocationType[]
    notIn?: $Enums.LocationType[]
    not?: NestedEnumLocationTypeWithAggregatesFilter<$PrismaModel> | $Enums.LocationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationTypeFilter<$PrismaModel>
    _max?: NestedEnumLocationTypeFilter<$PrismaModel>
  }

  export type NestedEnumTxnTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TxnType | EnumTxnTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxnType[]
    notIn?: $Enums.TxnType[]
    not?: NestedEnumTxnTypeFilter<$PrismaModel> | $Enums.TxnType
  }

  export type NestedEnumTxnTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxnType | EnumTxnTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxnType[]
    notIn?: $Enums.TxnType[]
    not?: NestedEnumTxnTypeWithAggregatesFilter<$PrismaModel> | $Enums.TxnType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxnTypeFilter<$PrismaModel>
    _max?: NestedEnumTxnTypeFilter<$PrismaModel>
  }

  export type ProductionReportCreateWithoutCreatedByInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    proses: ProsesCreateNestedOneWithoutProductionReportsInput
    checkedBy?: UserCreateNestedOneWithoutCheckedProductionReportsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportUncheckedCreateWithoutCreatedByInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportCreateOrConnectWithoutCreatedByInput = {
    where: ProductionReportWhereUniqueInput
    create: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput>
  }

  export type ProductionReportCreateManyCreatedByInputEnvelope = {
    data: ProductionReportCreateManyCreatedByInput | ProductionReportCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProductionReportCreateWithoutCheckedByInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    proses: ProsesCreateNestedOneWithoutProductionReportsInput
    createdBy?: UserCreateNestedOneWithoutProductionReportsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportUncheckedCreateWithoutCheckedByInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportCreateOrConnectWithoutCheckedByInput = {
    where: ProductionReportWhereUniqueInput
    create: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput>
  }

  export type ProductionReportCreateManyCheckedByInputEnvelope = {
    data: ProductionReportCreateManyCheckedByInput | ProductionReportCreateManyCheckedByInput[]
    skipDuplicates?: boolean
  }

  export type ItemCreateWithoutCreatedByInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutItemMasterInput
    material?: MaterialCreateNestedOneWithoutItemInput
    fgPros?: ProCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUncheckedCreateWithoutCreatedByInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput
    material?: MaterialUncheckedCreateNestedOneWithoutItemInput
    fgPros?: ProUncheckedCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesUncheckedCreateNestedManyWithoutOutputItemInput
  }

  export type ItemCreateOrConnectWithoutCreatedByInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput>
  }

  export type ItemCreateManyCreatedByInputEnvelope = {
    data: ItemCreateManyCreatedByInput | ItemCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ProductionReportUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ProductionReportWhereUniqueInput
    update: XOR<ProductionReportUpdateWithoutCreatedByInput, ProductionReportUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ProductionReportCreateWithoutCreatedByInput, ProductionReportUncheckedCreateWithoutCreatedByInput>
  }

  export type ProductionReportUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ProductionReportWhereUniqueInput
    data: XOR<ProductionReportUpdateWithoutCreatedByInput, ProductionReportUncheckedUpdateWithoutCreatedByInput>
  }

  export type ProductionReportUpdateManyWithWhereWithoutCreatedByInput = {
    where: ProductionReportScalarWhereInput
    data: XOR<ProductionReportUpdateManyMutationInput, ProductionReportUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ProductionReportScalarWhereInput = {
    AND?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
    OR?: ProductionReportScalarWhereInput[]
    NOT?: ProductionReportScalarWhereInput | ProductionReportScalarWhereInput[]
    id?: StringFilter<"ProductionReport"> | string
    prosesId?: IntFilter<"ProductionReport"> | number
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
    qtyReject?: DecimalFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: JsonNullableFilter<"ProductionReport">
    downtimeBreakdown?: JsonNullableFilter<"ProductionReport">
    totalDowntime?: IntFilter<"ProductionReport"> | number
    notes?: StringNullableFilter<"ProductionReport"> | string | null
    othersNote?: StringNullableFilter<"ProductionReport"> | string | null
    adminNote?: StringNullableFilter<"ProductionReport"> | string | null
    metaData?: JsonNullableFilter<"ProductionReport">
    createdById?: StringNullableFilter<"ProductionReport"> | string | null
    createdAt?: DateTimeFilter<"ProductionReport"> | Date | string
    updatedAt?: DateTimeFilter<"ProductionReport"> | Date | string
    status?: EnumReportStatusFilter<"ProductionReport"> | $Enums.ReportStatus
    rejectionNote?: StringNullableFilter<"ProductionReport"> | string | null
    checkedById?: StringNullableFilter<"ProductionReport"> | string | null
    checkedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    voidedById?: StringNullableFilter<"ProductionReport"> | string | null
    voidReason?: StringNullableFilter<"ProductionReport"> | string | null
    stockPostedAt?: DateTimeNullableFilter<"ProductionReport"> | Date | string | null
    inputWipQty?: DecimalNullableFilter<"ProductionReport"> | Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportUpsertWithWhereUniqueWithoutCheckedByInput = {
    where: ProductionReportWhereUniqueInput
    update: XOR<ProductionReportUpdateWithoutCheckedByInput, ProductionReportUncheckedUpdateWithoutCheckedByInput>
    create: XOR<ProductionReportCreateWithoutCheckedByInput, ProductionReportUncheckedCreateWithoutCheckedByInput>
  }

  export type ProductionReportUpdateWithWhereUniqueWithoutCheckedByInput = {
    where: ProductionReportWhereUniqueInput
    data: XOR<ProductionReportUpdateWithoutCheckedByInput, ProductionReportUncheckedUpdateWithoutCheckedByInput>
  }

  export type ProductionReportUpdateManyWithWhereWithoutCheckedByInput = {
    where: ProductionReportScalarWhereInput
    data: XOR<ProductionReportUpdateManyMutationInput, ProductionReportUncheckedUpdateManyWithoutCheckedByInput>
  }

  export type ItemUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ItemWhereUniqueInput
    update: XOR<ItemUpdateWithoutCreatedByInput, ItemUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ItemCreateWithoutCreatedByInput, ItemUncheckedCreateWithoutCreatedByInput>
  }

  export type ItemUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ItemWhereUniqueInput
    data: XOR<ItemUpdateWithoutCreatedByInput, ItemUncheckedUpdateWithoutCreatedByInput>
  }

  export type ItemUpdateManyWithWhereWithoutCreatedByInput = {
    where: ItemScalarWhereInput
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ItemScalarWhereInput = {
    AND?: ItemScalarWhereInput | ItemScalarWhereInput[]
    OR?: ItemScalarWhereInput[]
    NOT?: ItemScalarWhereInput | ItemScalarWhereInput[]
    id?: IntFilter<"Item"> | number
    code?: StringFilter<"Item"> | string
    name?: StringFilter<"Item"> | string
    kind?: EnumItemKindFilter<"Item"> | $Enums.ItemKind
    status?: EnumItemStatusFilter<"Item"> | $Enums.ItemStatus
    baseUom?: StringNullableFilter<"Item"> | string | null
    createdById?: StringNullableFilter<"Item"> | string | null
    createdFrom?: StringNullableFilter<"Item"> | string | null
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
  }

  export type ProsesCreateWithoutMachineInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutMachineInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutMachineInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput>
  }

  export type ProsesCreateManyMachineInputEnvelope = {
    data: ProsesCreateManyMachineInput | ProsesCreateManyMachineInput[]
    skipDuplicates?: boolean
  }

  export type InventoryLocationCreateWithoutMachineInput = {
    code: string
    name: string
    type: $Enums.LocationType
    txns?: InventoryTxnCreateNestedManyWithoutLocationInput
  }

  export type InventoryLocationUncheckedCreateWithoutMachineInput = {
    id?: number
    code: string
    name: string
    type: $Enums.LocationType
    txns?: InventoryTxnUncheckedCreateNestedManyWithoutLocationInput
  }

  export type InventoryLocationCreateOrConnectWithoutMachineInput = {
    where: InventoryLocationWhereUniqueInput
    create: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
  }

  export type ProsesUpsertWithWhereUniqueWithoutMachineInput = {
    where: ProsesWhereUniqueInput
    update: XOR<ProsesUpdateWithoutMachineInput, ProsesUncheckedUpdateWithoutMachineInput>
    create: XOR<ProsesCreateWithoutMachineInput, ProsesUncheckedCreateWithoutMachineInput>
  }

  export type ProsesUpdateWithWhereUniqueWithoutMachineInput = {
    where: ProsesWhereUniqueInput
    data: XOR<ProsesUpdateWithoutMachineInput, ProsesUncheckedUpdateWithoutMachineInput>
  }

  export type ProsesUpdateManyWithWhereWithoutMachineInput = {
    where: ProsesScalarWhereInput
    data: XOR<ProsesUpdateManyMutationInput, ProsesUncheckedUpdateManyWithoutMachineInput>
  }

  export type ProsesScalarWhereInput = {
    AND?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
    OR?: ProsesScalarWhereInput[]
    NOT?: ProsesScalarWhereInput | ProsesScalarWhereInput[]
    id?: IntFilter<"Proses"> | number
    proId?: IntFilter<"Proses"> | number
    orderNo?: IntFilter<"Proses"> | number
    up?: IntNullableFilter<"Proses"> | number | null
    estimatedShifts?: IntNullableFilter<"Proses"> | number | null
    startDate?: DateTimeNullableFilter<"Proses"> | Date | string | null
    machineId?: IntNullableFilter<"Proses"> | number | null
    partNumber?: StringNullableFilter<"Proses"> | string | null
    batchNo?: StringNullableFilter<"Proses"> | string | null
    outputItemId?: IntNullableFilter<"Proses"> | number | null
  }

  export type InventoryLocationUpsertWithoutMachineInput = {
    update: XOR<InventoryLocationUpdateWithoutMachineInput, InventoryLocationUncheckedUpdateWithoutMachineInput>
    create: XOR<InventoryLocationCreateWithoutMachineInput, InventoryLocationUncheckedCreateWithoutMachineInput>
    where?: InventoryLocationWhereInput
  }

  export type InventoryLocationUpdateToOneWithWhereWithoutMachineInput = {
    where?: InventoryLocationWhereInput
    data: XOR<InventoryLocationUpdateWithoutMachineInput, InventoryLocationUncheckedUpdateWithoutMachineInput>
  }

  export type InventoryLocationUpdateWithoutMachineInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    txns?: InventoryTxnUpdateManyWithoutLocationNestedInput
  }

  export type InventoryLocationUncheckedUpdateWithoutMachineInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    txns?: InventoryTxnUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type ProsesMaterialCreateWithoutMaterialInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    proses: ProsesCreateNestedOneWithoutMaterialsInput
  }

  export type ProsesMaterialUncheckedCreateWithoutMaterialInput = {
    id?: number
    prosesId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialCreateOrConnectWithoutMaterialInput = {
    where: ProsesMaterialWhereUniqueInput
    create: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput>
  }

  export type ProsesMaterialCreateManyMaterialInputEnvelope = {
    data: ProsesMaterialCreateManyMaterialInput | ProsesMaterialCreateManyMaterialInput[]
    skipDuplicates?: boolean
  }

  export type ItemCreateWithoutMaterialInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedItemsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutItemMasterInput
    fgPros?: ProCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUncheckedCreateWithoutMaterialInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput
    fgPros?: ProUncheckedCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesUncheckedCreateNestedManyWithoutOutputItemInput
  }

  export type ItemCreateOrConnectWithoutMaterialInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutMaterialInput, ItemUncheckedCreateWithoutMaterialInput>
  }

  export type ProsesMaterialUpsertWithWhereUniqueWithoutMaterialInput = {
    where: ProsesMaterialWhereUniqueInput
    update: XOR<ProsesMaterialUpdateWithoutMaterialInput, ProsesMaterialUncheckedUpdateWithoutMaterialInput>
    create: XOR<ProsesMaterialCreateWithoutMaterialInput, ProsesMaterialUncheckedCreateWithoutMaterialInput>
  }

  export type ProsesMaterialUpdateWithWhereUniqueWithoutMaterialInput = {
    where: ProsesMaterialWhereUniqueInput
    data: XOR<ProsesMaterialUpdateWithoutMaterialInput, ProsesMaterialUncheckedUpdateWithoutMaterialInput>
  }

  export type ProsesMaterialUpdateManyWithWhereWithoutMaterialInput = {
    where: ProsesMaterialScalarWhereInput
    data: XOR<ProsesMaterialUpdateManyMutationInput, ProsesMaterialUncheckedUpdateManyWithoutMaterialInput>
  }

  export type ProsesMaterialScalarWhereInput = {
    AND?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
    OR?: ProsesMaterialScalarWhereInput[]
    NOT?: ProsesMaterialScalarWhereInput | ProsesMaterialScalarWhereInput[]
    id?: IntFilter<"ProsesMaterial"> | number
    prosesId?: IntFilter<"ProsesMaterial"> | number
    materialId?: IntFilter<"ProsesMaterial"> | number
    qtyReq?: DecimalFilter<"ProsesMaterial"> | Decimal | DecimalJsLike | number | string
  }

  export type ItemUpsertWithoutMaterialInput = {
    update: XOR<ItemUpdateWithoutMaterialInput, ItemUncheckedUpdateWithoutMaterialInput>
    create: XOR<ItemCreateWithoutMaterialInput, ItemUncheckedCreateWithoutMaterialInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutMaterialInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutMaterialInput, ItemUncheckedUpdateWithoutMaterialInput>
  }

  export type ItemUpdateWithoutMaterialInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedItemsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutItemMasterNestedInput
    fgPros?: ProUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput
    fgPros?: ProUncheckedUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUncheckedUpdateManyWithoutOutputItemNestedInput
  }

  export type UserCreateWithoutCreatedItemsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportCreateNestedManyWithoutCreatedByInput
    checkedProductionReports?: ProductionReportCreateNestedManyWithoutCheckedByInput
  }

  export type UserUncheckedCreateWithoutCreatedItemsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutCreatedByInput
    checkedProductionReports?: ProductionReportUncheckedCreateNestedManyWithoutCheckedByInput
  }

  export type UserCreateOrConnectWithoutCreatedItemsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedItemsInput, UserUncheckedCreateWithoutCreatedItemsInput>
  }

  export type InventoryTxnCreateWithoutItemMasterInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    location: InventoryLocationCreateNestedOneWithoutTxnsInput
    pro?: ProCreateNestedOneWithoutInventoryTxnsInput
    proses?: ProsesCreateNestedOneWithoutInventoryTxnsInput
    productionReport?: ProductionReportCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateWithoutItemMasterInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    locationId: number
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnCreateOrConnectWithoutItemMasterInput = {
    where: InventoryTxnWhereUniqueInput
    create: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput>
  }

  export type InventoryTxnCreateManyItemMasterInputEnvelope = {
    data: InventoryTxnCreateManyItemMasterInput | InventoryTxnCreateManyItemMasterInput[]
    skipDuplicates?: boolean
  }

  export type MaterialCreateWithoutItemInput = {
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    prosesMaterials?: ProsesMaterialCreateNestedManyWithoutMaterialInput
  }

  export type MaterialUncheckedCreateWithoutItemInput = {
    id?: number
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    prosesMaterials?: ProsesMaterialUncheckedCreateNestedManyWithoutMaterialInput
  }

  export type MaterialCreateOrConnectWithoutItemInput = {
    where: MaterialWhereUniqueInput
    create: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
  }

  export type ProCreateWithoutFgItemInput = {
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    proPrefix?: ProPrefixCreateNestedOneWithoutProsInput
    proses?: ProsesCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateWithoutFgItemInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProInput
  }

  export type ProCreateOrConnectWithoutFgItemInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput>
  }

  export type ProCreateManyFgItemInputEnvelope = {
    data: ProCreateManyFgItemInput | ProCreateManyFgItemInput[]
    skipDuplicates?: boolean
  }

  export type ProsesCreateWithoutOutputItemInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    machine?: MachineCreateNestedOneWithoutProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutOutputItemInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutOutputItemInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput>
  }

  export type ProsesCreateManyOutputItemInputEnvelope = {
    data: ProsesCreateManyOutputItemInput | ProsesCreateManyOutputItemInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedItemsInput = {
    update: XOR<UserUpdateWithoutCreatedItemsInput, UserUncheckedUpdateWithoutCreatedItemsInput>
    create: XOR<UserCreateWithoutCreatedItemsInput, UserUncheckedCreateWithoutCreatedItemsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedItemsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedItemsInput, UserUncheckedUpdateWithoutCreatedItemsInput>
  }

  export type UserUpdateWithoutCreatedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUpdateManyWithoutCreatedByNestedInput
    checkedProductionReports?: ProductionReportUpdateManyWithoutCheckedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUncheckedUpdateManyWithoutCreatedByNestedInput
    checkedProductionReports?: ProductionReportUncheckedUpdateManyWithoutCheckedByNestedInput
  }

  export type InventoryTxnUpsertWithWhereUniqueWithoutItemMasterInput = {
    where: InventoryTxnWhereUniqueInput
    update: XOR<InventoryTxnUpdateWithoutItemMasterInput, InventoryTxnUncheckedUpdateWithoutItemMasterInput>
    create: XOR<InventoryTxnCreateWithoutItemMasterInput, InventoryTxnUncheckedCreateWithoutItemMasterInput>
  }

  export type InventoryTxnUpdateWithWhereUniqueWithoutItemMasterInput = {
    where: InventoryTxnWhereUniqueInput
    data: XOR<InventoryTxnUpdateWithoutItemMasterInput, InventoryTxnUncheckedUpdateWithoutItemMasterInput>
  }

  export type InventoryTxnUpdateManyWithWhereWithoutItemMasterInput = {
    where: InventoryTxnScalarWhereInput
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyWithoutItemMasterInput>
  }

  export type InventoryTxnScalarWhereInput = {
    AND?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
    OR?: InventoryTxnScalarWhereInput[]
    NOT?: InventoryTxnScalarWhereInput | InventoryTxnScalarWhereInput[]
    id?: StringFilter<"InventoryTxn"> | string
    groupId?: StringFilter<"InventoryTxn"> | string
    date?: DateTimeFilter<"InventoryTxn"> | Date | string
    type?: EnumTxnTypeFilter<"InventoryTxn"> | $Enums.TxnType
    itemId?: StringFilter<"InventoryTxn"> | string
    qty?: DecimalFilter<"InventoryTxn"> | Decimal | DecimalJsLike | number | string
    itemMasterId?: IntNullableFilter<"InventoryTxn"> | number | null
    locationId?: IntFilter<"InventoryTxn"> | number
    proId?: IntNullableFilter<"InventoryTxn"> | number | null
    prosesId?: IntNullableFilter<"InventoryTxn"> | number | null
    productionReportId?: StringNullableFilter<"InventoryTxn"> | string | null
    notes?: StringNullableFilter<"InventoryTxn"> | string | null
    createdAt?: DateTimeFilter<"InventoryTxn"> | Date | string
  }

  export type MaterialUpsertWithoutItemInput = {
    update: XOR<MaterialUpdateWithoutItemInput, MaterialUncheckedUpdateWithoutItemInput>
    create: XOR<MaterialCreateWithoutItemInput, MaterialUncheckedCreateWithoutItemInput>
    where?: MaterialWhereInput
  }

  export type MaterialUpdateToOneWithWhereWithoutItemInput = {
    where?: MaterialWhereInput
    data: XOR<MaterialUpdateWithoutItemInput, MaterialUncheckedUpdateWithoutItemInput>
  }

  export type MaterialUpdateWithoutItemInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prosesMaterials?: ProsesMaterialUpdateManyWithoutMaterialNestedInput
  }

  export type MaterialUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prosesMaterials?: ProsesMaterialUncheckedUpdateManyWithoutMaterialNestedInput
  }

  export type ProUpsertWithWhereUniqueWithoutFgItemInput = {
    where: ProWhereUniqueInput
    update: XOR<ProUpdateWithoutFgItemInput, ProUncheckedUpdateWithoutFgItemInput>
    create: XOR<ProCreateWithoutFgItemInput, ProUncheckedCreateWithoutFgItemInput>
  }

  export type ProUpdateWithWhereUniqueWithoutFgItemInput = {
    where: ProWhereUniqueInput
    data: XOR<ProUpdateWithoutFgItemInput, ProUncheckedUpdateWithoutFgItemInput>
  }

  export type ProUpdateManyWithWhereWithoutFgItemInput = {
    where: ProScalarWhereInput
    data: XOR<ProUpdateManyMutationInput, ProUncheckedUpdateManyWithoutFgItemInput>
  }

  export type ProScalarWhereInput = {
    AND?: ProScalarWhereInput | ProScalarWhereInput[]
    OR?: ProScalarWhereInput[]
    NOT?: ProScalarWhereInput | ProScalarWhereInput[]
    id?: IntFilter<"Pro"> | number
    proNumber?: StringFilter<"Pro"> | string
    productName?: StringFilter<"Pro"> | string
    partNumber?: StringNullableFilter<"Pro"> | string | null
    qtyPoPcs?: IntFilter<"Pro"> | number
    startDate?: DateTimeNullableFilter<"Pro"> | Date | string | null
    status?: EnumProStatusFilter<"Pro"> | $Enums.ProStatus
    type?: EnumProTypeFilter<"Pro"> | $Enums.ProType
    autoShiftExpansion?: BoolFilter<"Pro"> | boolean
    proPrefixId?: IntNullableFilter<"Pro"> | number | null
    fgItemId?: IntNullableFilter<"Pro"> | number | null
    createdAt?: DateTimeFilter<"Pro"> | Date | string
    updatedAt?: DateTimeFilter<"Pro"> | Date | string
  }

  export type ProsesUpsertWithWhereUniqueWithoutOutputItemInput = {
    where: ProsesWhereUniqueInput
    update: XOR<ProsesUpdateWithoutOutputItemInput, ProsesUncheckedUpdateWithoutOutputItemInput>
    create: XOR<ProsesCreateWithoutOutputItemInput, ProsesUncheckedCreateWithoutOutputItemInput>
  }

  export type ProsesUpdateWithWhereUniqueWithoutOutputItemInput = {
    where: ProsesWhereUniqueInput
    data: XOR<ProsesUpdateWithoutOutputItemInput, ProsesUncheckedUpdateWithoutOutputItemInput>
  }

  export type ProsesUpdateManyWithWhereWithoutOutputItemInput = {
    where: ProsesScalarWhereInput
    data: XOR<ProsesUpdateManyMutationInput, ProsesUncheckedUpdateManyWithoutOutputItemInput>
  }

  export type ProCreateWithoutProPrefixInput = {
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    fgItem?: ItemCreateNestedOneWithoutFgProsInput
    proses?: ProsesCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateWithoutProPrefixInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutProInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProInput
  }

  export type ProCreateOrConnectWithoutProPrefixInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput>
  }

  export type ProCreateManyProPrefixInputEnvelope = {
    data: ProCreateManyProPrefixInput | ProCreateManyProPrefixInput[]
    skipDuplicates?: boolean
  }

  export type ProUpsertWithWhereUniqueWithoutProPrefixInput = {
    where: ProWhereUniqueInput
    update: XOR<ProUpdateWithoutProPrefixInput, ProUncheckedUpdateWithoutProPrefixInput>
    create: XOR<ProCreateWithoutProPrefixInput, ProUncheckedCreateWithoutProPrefixInput>
  }

  export type ProUpdateWithWhereUniqueWithoutProPrefixInput = {
    where: ProWhereUniqueInput
    data: XOR<ProUpdateWithoutProPrefixInput, ProUncheckedUpdateWithoutProPrefixInput>
  }

  export type ProUpdateManyWithWhereWithoutProPrefixInput = {
    where: ProScalarWhereInput
    data: XOR<ProUpdateManyMutationInput, ProUncheckedUpdateManyWithoutProPrefixInput>
  }

  export type ProPrefixCreateWithoutProsInput = {
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProPrefixUncheckedCreateWithoutProsInput = {
    id?: number
    code: string
    name: string
    type?: $Enums.ProType
  }

  export type ProPrefixCreateOrConnectWithoutProsInput = {
    where: ProPrefixWhereUniqueInput
    create: XOR<ProPrefixCreateWithoutProsInput, ProPrefixUncheckedCreateWithoutProsInput>
  }

  export type ItemCreateWithoutFgProsInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedItemsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutItemMasterInput
    material?: MaterialCreateNestedOneWithoutItemInput
    outputProses?: ProsesCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUncheckedCreateWithoutFgProsInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput
    material?: MaterialUncheckedCreateNestedOneWithoutItemInput
    outputProses?: ProsesUncheckedCreateNestedManyWithoutOutputItemInput
  }

  export type ItemCreateOrConnectWithoutFgProsInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutFgProsInput, ItemUncheckedCreateWithoutFgProsInput>
  }

  export type ProsesCreateWithoutProInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    machine?: MachineCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutProInput = {
    id?: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutProInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput>
  }

  export type ProsesCreateManyProInputEnvelope = {
    data: ProsesCreateManyProInput | ProsesCreateManyProInput[]
    skipDuplicates?: boolean
  }

  export type InventoryTxnCreateWithoutProInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    itemMaster?: ItemCreateNestedOneWithoutInventoryTxnsInput
    location: InventoryLocationCreateNestedOneWithoutTxnsInput
    proses?: ProsesCreateNestedOneWithoutInventoryTxnsInput
    productionReport?: ProductionReportCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateWithoutProInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnCreateOrConnectWithoutProInput = {
    where: InventoryTxnWhereUniqueInput
    create: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput>
  }

  export type InventoryTxnCreateManyProInputEnvelope = {
    data: InventoryTxnCreateManyProInput | InventoryTxnCreateManyProInput[]
    skipDuplicates?: boolean
  }

  export type ProPrefixUpsertWithoutProsInput = {
    update: XOR<ProPrefixUpdateWithoutProsInput, ProPrefixUncheckedUpdateWithoutProsInput>
    create: XOR<ProPrefixCreateWithoutProsInput, ProPrefixUncheckedCreateWithoutProsInput>
    where?: ProPrefixWhereInput
  }

  export type ProPrefixUpdateToOneWithWhereWithoutProsInput = {
    where?: ProPrefixWhereInput
    data: XOR<ProPrefixUpdateWithoutProsInput, ProPrefixUncheckedUpdateWithoutProsInput>
  }

  export type ProPrefixUpdateWithoutProsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ProPrefixUncheckedUpdateWithoutProsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
  }

  export type ItemUpsertWithoutFgProsInput = {
    update: XOR<ItemUpdateWithoutFgProsInput, ItemUncheckedUpdateWithoutFgProsInput>
    create: XOR<ItemCreateWithoutFgProsInput, ItemUncheckedCreateWithoutFgProsInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutFgProsInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutFgProsInput, ItemUncheckedUpdateWithoutFgProsInput>
  }

  export type ItemUpdateWithoutFgProsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedItemsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUpdateOneWithoutItemNestedInput
    outputProses?: ProsesUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutFgProsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUncheckedUpdateOneWithoutItemNestedInput
    outputProses?: ProsesUncheckedUpdateManyWithoutOutputItemNestedInput
  }

  export type ProsesUpsertWithWhereUniqueWithoutProInput = {
    where: ProsesWhereUniqueInput
    update: XOR<ProsesUpdateWithoutProInput, ProsesUncheckedUpdateWithoutProInput>
    create: XOR<ProsesCreateWithoutProInput, ProsesUncheckedCreateWithoutProInput>
  }

  export type ProsesUpdateWithWhereUniqueWithoutProInput = {
    where: ProsesWhereUniqueInput
    data: XOR<ProsesUpdateWithoutProInput, ProsesUncheckedUpdateWithoutProInput>
  }

  export type ProsesUpdateManyWithWhereWithoutProInput = {
    where: ProsesScalarWhereInput
    data: XOR<ProsesUpdateManyMutationInput, ProsesUncheckedUpdateManyWithoutProInput>
  }

  export type InventoryTxnUpsertWithWhereUniqueWithoutProInput = {
    where: InventoryTxnWhereUniqueInput
    update: XOR<InventoryTxnUpdateWithoutProInput, InventoryTxnUncheckedUpdateWithoutProInput>
    create: XOR<InventoryTxnCreateWithoutProInput, InventoryTxnUncheckedCreateWithoutProInput>
  }

  export type InventoryTxnUpdateWithWhereUniqueWithoutProInput = {
    where: InventoryTxnWhereUniqueInput
    data: XOR<InventoryTxnUpdateWithoutProInput, InventoryTxnUncheckedUpdateWithoutProInput>
  }

  export type InventoryTxnUpdateManyWithWhereWithoutProInput = {
    where: InventoryTxnScalarWhereInput
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyWithoutProInput>
  }

  export type ProCreateWithoutProsesInput = {
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    proPrefix?: ProPrefixCreateNestedOneWithoutProsInput
    fgItem?: ItemCreateNestedOneWithoutFgProsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateWithoutProsesInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProInput
  }

  export type ProCreateOrConnectWithoutProsesInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutProsesInput, ProUncheckedCreateWithoutProsesInput>
  }

  export type MachineCreateWithoutProsesInput = {
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location?: InventoryLocationCreateNestedOneWithoutMachineInput
  }

  export type MachineUncheckedCreateWithoutProsesInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location?: InventoryLocationUncheckedCreateNestedOneWithoutMachineInput
  }

  export type MachineCreateOrConnectWithoutProsesInput = {
    where: MachineWhereUniqueInput
    create: XOR<MachineCreateWithoutProsesInput, MachineUncheckedCreateWithoutProsesInput>
  }

  export type ItemCreateWithoutOutputProsesInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedItemsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutItemMasterInput
    material?: MaterialCreateNestedOneWithoutItemInput
    fgPros?: ProCreateNestedManyWithoutFgItemInput
  }

  export type ItemUncheckedCreateWithoutOutputProsesInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutItemMasterInput
    material?: MaterialUncheckedCreateNestedOneWithoutItemInput
    fgPros?: ProUncheckedCreateNestedManyWithoutFgItemInput
  }

  export type ItemCreateOrConnectWithoutOutputProsesInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutOutputProsesInput, ItemUncheckedCreateWithoutOutputProsesInput>
  }

  export type ProsesMaterialCreateWithoutProsesInput = {
    qtyReq: Decimal | DecimalJsLike | number | string
    material: MaterialCreateNestedOneWithoutProsesMaterialsInput
  }

  export type ProsesMaterialUncheckedCreateWithoutProsesInput = {
    id?: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialCreateOrConnectWithoutProsesInput = {
    where: ProsesMaterialWhereUniqueInput
    create: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput>
  }

  export type ProsesMaterialCreateManyProsesInputEnvelope = {
    data: ProsesMaterialCreateManyProsesInput | ProsesMaterialCreateManyProsesInput[]
    skipDuplicates?: boolean
  }

  export type ProductionReportCreateWithoutProsesInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    createdBy?: UserCreateNestedOneWithoutProductionReportsInput
    checkedBy?: UserCreateNestedOneWithoutCheckedProductionReportsInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportUncheckedCreateWithoutProsesInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProductionReportInput
  }

  export type ProductionReportCreateOrConnectWithoutProsesInput = {
    where: ProductionReportWhereUniqueInput
    create: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput>
  }

  export type ProductionReportCreateManyProsesInputEnvelope = {
    data: ProductionReportCreateManyProsesInput | ProductionReportCreateManyProsesInput[]
    skipDuplicates?: boolean
  }

  export type InventoryTxnCreateWithoutProsesInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    itemMaster?: ItemCreateNestedOneWithoutInventoryTxnsInput
    location: InventoryLocationCreateNestedOneWithoutTxnsInput
    pro?: ProCreateNestedOneWithoutInventoryTxnsInput
    productionReport?: ProductionReportCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateWithoutProsesInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnCreateOrConnectWithoutProsesInput = {
    where: InventoryTxnWhereUniqueInput
    create: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput>
  }

  export type InventoryTxnCreateManyProsesInputEnvelope = {
    data: InventoryTxnCreateManyProsesInput | InventoryTxnCreateManyProsesInput[]
    skipDuplicates?: boolean
  }

  export type ProUpsertWithoutProsesInput = {
    update: XOR<ProUpdateWithoutProsesInput, ProUncheckedUpdateWithoutProsesInput>
    create: XOR<ProCreateWithoutProsesInput, ProUncheckedCreateWithoutProsesInput>
    where?: ProWhereInput
  }

  export type ProUpdateToOneWithWhereWithoutProsesInput = {
    where?: ProWhereInput
    data: XOR<ProUpdateWithoutProsesInput, ProUncheckedUpdateWithoutProsesInput>
  }

  export type ProUpdateWithoutProsesInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proPrefix?: ProPrefixUpdateOneWithoutProsNestedInput
    fgItem?: ItemUpdateOneWithoutFgProsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateWithoutProsesInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProNestedInput
  }

  export type MachineUpsertWithoutProsesInput = {
    update: XOR<MachineUpdateWithoutProsesInput, MachineUncheckedUpdateWithoutProsesInput>
    create: XOR<MachineCreateWithoutProsesInput, MachineUncheckedCreateWithoutProsesInput>
    where?: MachineWhereInput
  }

  export type MachineUpdateToOneWithWhereWithoutProsesInput = {
    where?: MachineWhereInput
    data: XOR<MachineUpdateWithoutProsesInput, MachineUncheckedUpdateWithoutProsesInput>
  }

  export type MachineUpdateWithoutProsesInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: InventoryLocationUpdateOneWithoutMachineNestedInput
  }

  export type MachineUncheckedUpdateWithoutProsesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: InventoryLocationUncheckedUpdateOneWithoutMachineNestedInput
  }

  export type ItemUpsertWithoutOutputProsesInput = {
    update: XOR<ItemUpdateWithoutOutputProsesInput, ItemUncheckedUpdateWithoutOutputProsesInput>
    create: XOR<ItemCreateWithoutOutputProsesInput, ItemUncheckedCreateWithoutOutputProsesInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutOutputProsesInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutOutputProsesInput, ItemUncheckedUpdateWithoutOutputProsesInput>
  }

  export type ItemUpdateWithoutOutputProsesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedItemsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUpdateOneWithoutItemNestedInput
    fgPros?: ProUpdateManyWithoutFgItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutOutputProsesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUncheckedUpdateOneWithoutItemNestedInput
    fgPros?: ProUncheckedUpdateManyWithoutFgItemNestedInput
  }

  export type ProsesMaterialUpsertWithWhereUniqueWithoutProsesInput = {
    where: ProsesMaterialWhereUniqueInput
    update: XOR<ProsesMaterialUpdateWithoutProsesInput, ProsesMaterialUncheckedUpdateWithoutProsesInput>
    create: XOR<ProsesMaterialCreateWithoutProsesInput, ProsesMaterialUncheckedCreateWithoutProsesInput>
  }

  export type ProsesMaterialUpdateWithWhereUniqueWithoutProsesInput = {
    where: ProsesMaterialWhereUniqueInput
    data: XOR<ProsesMaterialUpdateWithoutProsesInput, ProsesMaterialUncheckedUpdateWithoutProsesInput>
  }

  export type ProsesMaterialUpdateManyWithWhereWithoutProsesInput = {
    where: ProsesMaterialScalarWhereInput
    data: XOR<ProsesMaterialUpdateManyMutationInput, ProsesMaterialUncheckedUpdateManyWithoutProsesInput>
  }

  export type ProductionReportUpsertWithWhereUniqueWithoutProsesInput = {
    where: ProductionReportWhereUniqueInput
    update: XOR<ProductionReportUpdateWithoutProsesInput, ProductionReportUncheckedUpdateWithoutProsesInput>
    create: XOR<ProductionReportCreateWithoutProsesInput, ProductionReportUncheckedCreateWithoutProsesInput>
  }

  export type ProductionReportUpdateWithWhereUniqueWithoutProsesInput = {
    where: ProductionReportWhereUniqueInput
    data: XOR<ProductionReportUpdateWithoutProsesInput, ProductionReportUncheckedUpdateWithoutProsesInput>
  }

  export type ProductionReportUpdateManyWithWhereWithoutProsesInput = {
    where: ProductionReportScalarWhereInput
    data: XOR<ProductionReportUpdateManyMutationInput, ProductionReportUncheckedUpdateManyWithoutProsesInput>
  }

  export type InventoryTxnUpsertWithWhereUniqueWithoutProsesInput = {
    where: InventoryTxnWhereUniqueInput
    update: XOR<InventoryTxnUpdateWithoutProsesInput, InventoryTxnUncheckedUpdateWithoutProsesInput>
    create: XOR<InventoryTxnCreateWithoutProsesInput, InventoryTxnUncheckedCreateWithoutProsesInput>
  }

  export type InventoryTxnUpdateWithWhereUniqueWithoutProsesInput = {
    where: InventoryTxnWhereUniqueInput
    data: XOR<InventoryTxnUpdateWithoutProsesInput, InventoryTxnUncheckedUpdateWithoutProsesInput>
  }

  export type InventoryTxnUpdateManyWithWhereWithoutProsesInput = {
    where: InventoryTxnScalarWhereInput
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyWithoutProsesInput>
  }

  export type ProsesCreateWithoutMaterialsInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    machine?: MachineCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutMaterialsInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutMaterialsInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutMaterialsInput, ProsesUncheckedCreateWithoutMaterialsInput>
  }

  export type MaterialCreateWithoutProsesMaterialsInput = {
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    item?: ItemCreateNestedOneWithoutMaterialInput
  }

  export type MaterialUncheckedCreateWithoutProsesMaterialsInput = {
    id?: number
    name: string
    uom: string
    type?: $Enums.MaterialType
    createdAt?: Date | string
    updatedAt?: Date | string
    itemId?: number | null
  }

  export type MaterialCreateOrConnectWithoutProsesMaterialsInput = {
    where: MaterialWhereUniqueInput
    create: XOR<MaterialCreateWithoutProsesMaterialsInput, MaterialUncheckedCreateWithoutProsesMaterialsInput>
  }

  export type ProsesUpsertWithoutMaterialsInput = {
    update: XOR<ProsesUpdateWithoutMaterialsInput, ProsesUncheckedUpdateWithoutMaterialsInput>
    create: XOR<ProsesCreateWithoutMaterialsInput, ProsesUncheckedCreateWithoutMaterialsInput>
    where?: ProsesWhereInput
  }

  export type ProsesUpdateToOneWithWhereWithoutMaterialsInput = {
    where?: ProsesWhereInput
    data: XOR<ProsesUpdateWithoutMaterialsInput, ProsesUncheckedUpdateWithoutMaterialsInput>
  }

  export type ProsesUpdateWithoutMaterialsInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    machine?: MachineUpdateOneWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutMaterialsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type MaterialUpsertWithoutProsesMaterialsInput = {
    update: XOR<MaterialUpdateWithoutProsesMaterialsInput, MaterialUncheckedUpdateWithoutProsesMaterialsInput>
    create: XOR<MaterialCreateWithoutProsesMaterialsInput, MaterialUncheckedCreateWithoutProsesMaterialsInput>
    where?: MaterialWhereInput
  }

  export type MaterialUpdateToOneWithWhereWithoutProsesMaterialsInput = {
    where?: MaterialWhereInput
    data: XOR<MaterialUpdateWithoutProsesMaterialsInput, MaterialUncheckedUpdateWithoutProsesMaterialsInput>
  }

  export type MaterialUpdateWithoutProsesMaterialsInput = {
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: ItemUpdateOneWithoutMaterialNestedInput
  }

  export type MaterialUncheckedUpdateWithoutProsesMaterialsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    uom?: StringFieldUpdateOperationsInput | string
    type?: EnumMaterialTypeFieldUpdateOperationsInput | $Enums.MaterialType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProsesCreateWithoutProductionReportsInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    machine?: MachineCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutProductionReportsInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    inventoryTxns?: InventoryTxnUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutProductionReportsInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutProductionReportsInput, ProsesUncheckedCreateWithoutProductionReportsInput>
  }

  export type UserCreateWithoutProductionReportsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    checkedProductionReports?: ProductionReportCreateNestedManyWithoutCheckedByInput
    createdItems?: ItemCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutProductionReportsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    checkedProductionReports?: ProductionReportUncheckedCreateNestedManyWithoutCheckedByInput
    createdItems?: ItemUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutProductionReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProductionReportsInput, UserUncheckedCreateWithoutProductionReportsInput>
  }

  export type UserCreateWithoutCheckedProductionReportsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportCreateNestedManyWithoutCreatedByInput
    createdItems?: ItemCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutCheckedProductionReportsInput = {
    id?: string
    username: string
    passwordHash: string
    role?: $Enums.Role
    department?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutCreatedByInput
    createdItems?: ItemUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutCheckedProductionReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCheckedProductionReportsInput, UserUncheckedCreateWithoutCheckedProductionReportsInput>
  }

  export type InventoryTxnCreateWithoutProductionReportInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    itemMaster?: ItemCreateNestedOneWithoutInventoryTxnsInput
    location: InventoryLocationCreateNestedOneWithoutTxnsInput
    pro?: ProCreateNestedOneWithoutInventoryTxnsInput
    proses?: ProsesCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateWithoutProductionReportInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    prosesId?: number | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnCreateOrConnectWithoutProductionReportInput = {
    where: InventoryTxnWhereUniqueInput
    create: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput>
  }

  export type InventoryTxnCreateManyProductionReportInputEnvelope = {
    data: InventoryTxnCreateManyProductionReportInput | InventoryTxnCreateManyProductionReportInput[]
    skipDuplicates?: boolean
  }

  export type ProsesUpsertWithoutProductionReportsInput = {
    update: XOR<ProsesUpdateWithoutProductionReportsInput, ProsesUncheckedUpdateWithoutProductionReportsInput>
    create: XOR<ProsesCreateWithoutProductionReportsInput, ProsesUncheckedCreateWithoutProductionReportsInput>
    where?: ProsesWhereInput
  }

  export type ProsesUpdateToOneWithWhereWithoutProductionReportsInput = {
    where?: ProsesWhereInput
    data: XOR<ProsesUpdateWithoutProductionReportsInput, ProsesUncheckedUpdateWithoutProductionReportsInput>
  }

  export type ProsesUpdateWithoutProductionReportsInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    machine?: MachineUpdateOneWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutProductionReportsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type UserUpsertWithoutProductionReportsInput = {
    update: XOR<UserUpdateWithoutProductionReportsInput, UserUncheckedUpdateWithoutProductionReportsInput>
    create: XOR<UserCreateWithoutProductionReportsInput, UserUncheckedCreateWithoutProductionReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProductionReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProductionReportsInput, UserUncheckedUpdateWithoutProductionReportsInput>
  }

  export type UserUpdateWithoutProductionReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedProductionReports?: ProductionReportUpdateManyWithoutCheckedByNestedInput
    createdItems?: ItemUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProductionReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkedProductionReports?: ProductionReportUncheckedUpdateManyWithoutCheckedByNestedInput
    createdItems?: ItemUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUpsertWithoutCheckedProductionReportsInput = {
    update: XOR<UserUpdateWithoutCheckedProductionReportsInput, UserUncheckedUpdateWithoutCheckedProductionReportsInput>
    create: XOR<UserCreateWithoutCheckedProductionReportsInput, UserUncheckedCreateWithoutCheckedProductionReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCheckedProductionReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCheckedProductionReportsInput, UserUncheckedUpdateWithoutCheckedProductionReportsInput>
  }

  export type UserUpdateWithoutCheckedProductionReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUpdateManyWithoutCreatedByNestedInput
    createdItems?: ItemUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCheckedProductionReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    department?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionReports?: ProductionReportUncheckedUpdateManyWithoutCreatedByNestedInput
    createdItems?: ItemUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type InventoryTxnUpsertWithWhereUniqueWithoutProductionReportInput = {
    where: InventoryTxnWhereUniqueInput
    update: XOR<InventoryTxnUpdateWithoutProductionReportInput, InventoryTxnUncheckedUpdateWithoutProductionReportInput>
    create: XOR<InventoryTxnCreateWithoutProductionReportInput, InventoryTxnUncheckedCreateWithoutProductionReportInput>
  }

  export type InventoryTxnUpdateWithWhereUniqueWithoutProductionReportInput = {
    where: InventoryTxnWhereUniqueInput
    data: XOR<InventoryTxnUpdateWithoutProductionReportInput, InventoryTxnUncheckedUpdateWithoutProductionReportInput>
  }

  export type InventoryTxnUpdateManyWithWhereWithoutProductionReportInput = {
    where: InventoryTxnScalarWhereInput
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyWithoutProductionReportInput>
  }

  export type MachineCreateWithoutLocationInput = {
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesCreateNestedManyWithoutMachineInput
  }

  export type MachineUncheckedCreateWithoutLocationInput = {
    id?: number
    name: string
    stdOutputPerHour: number
    stdOutputPerShift: number
    uom: $Enums.Uom
    type?: $Enums.MachineType
    remark?: string | null
    cycleTimeSec?: Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: Decimal | DecimalJsLike | number | string | null
    cavity?: number | null
    manPower?: number | null
    stdOutputPerDay?: number | null
    workCenter?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutMachineInput
  }

  export type MachineCreateOrConnectWithoutLocationInput = {
    where: MachineWhereUniqueInput
    create: XOR<MachineCreateWithoutLocationInput, MachineUncheckedCreateWithoutLocationInput>
  }

  export type InventoryTxnCreateWithoutLocationInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    notes?: string | null
    createdAt?: Date | string
    itemMaster?: ItemCreateNestedOneWithoutInventoryTxnsInput
    pro?: ProCreateNestedOneWithoutInventoryTxnsInput
    proses?: ProsesCreateNestedOneWithoutInventoryTxnsInput
    productionReport?: ProductionReportCreateNestedOneWithoutInventoryTxnsInput
  }

  export type InventoryTxnUncheckedCreateWithoutLocationInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnCreateOrConnectWithoutLocationInput = {
    where: InventoryTxnWhereUniqueInput
    create: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput>
  }

  export type InventoryTxnCreateManyLocationInputEnvelope = {
    data: InventoryTxnCreateManyLocationInput | InventoryTxnCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type MachineUpsertWithoutLocationInput = {
    update: XOR<MachineUpdateWithoutLocationInput, MachineUncheckedUpdateWithoutLocationInput>
    create: XOR<MachineCreateWithoutLocationInput, MachineUncheckedCreateWithoutLocationInput>
    where?: MachineWhereInput
  }

  export type MachineUpdateToOneWithWhereWithoutLocationInput = {
    where?: MachineWhereInput
    data: XOR<MachineUpdateWithoutLocationInput, MachineUncheckedUpdateWithoutLocationInput>
  }

  export type MachineUpdateWithoutLocationInput = {
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUpdateManyWithoutMachineNestedInput
  }

  export type MachineUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    stdOutputPerHour?: IntFieldUpdateOperationsInput | number
    stdOutputPerShift?: IntFieldUpdateOperationsInput | number
    uom?: EnumUomFieldUpdateOperationsInput | $Enums.Uom
    type?: EnumMachineTypeFieldUpdateOperationsInput | $Enums.MachineType
    remark?: NullableStringFieldUpdateOperationsInput | string | null
    cycleTimeSec?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cycleTimeMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cavity?: NullableIntFieldUpdateOperationsInput | number | null
    manPower?: NullableIntFieldUpdateOperationsInput | number | null
    stdOutputPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    workCenter?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutMachineNestedInput
  }

  export type InventoryTxnUpsertWithWhereUniqueWithoutLocationInput = {
    where: InventoryTxnWhereUniqueInput
    update: XOR<InventoryTxnUpdateWithoutLocationInput, InventoryTxnUncheckedUpdateWithoutLocationInput>
    create: XOR<InventoryTxnCreateWithoutLocationInput, InventoryTxnUncheckedCreateWithoutLocationInput>
  }

  export type InventoryTxnUpdateWithWhereUniqueWithoutLocationInput = {
    where: InventoryTxnWhereUniqueInput
    data: XOR<InventoryTxnUpdateWithoutLocationInput, InventoryTxnUncheckedUpdateWithoutLocationInput>
  }

  export type InventoryTxnUpdateManyWithWhereWithoutLocationInput = {
    where: InventoryTxnScalarWhereInput
    data: XOR<InventoryTxnUpdateManyMutationInput, InventoryTxnUncheckedUpdateManyWithoutLocationInput>
  }

  export type ItemCreateWithoutInventoryTxnsInput = {
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedItemsInput
    material?: MaterialCreateNestedOneWithoutItemInput
    fgPros?: ProCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesCreateNestedManyWithoutOutputItemInput
  }

  export type ItemUncheckedCreateWithoutInventoryTxnsInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdById?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    material?: MaterialUncheckedCreateNestedOneWithoutItemInput
    fgPros?: ProUncheckedCreateNestedManyWithoutFgItemInput
    outputProses?: ProsesUncheckedCreateNestedManyWithoutOutputItemInput
  }

  export type ItemCreateOrConnectWithoutInventoryTxnsInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutInventoryTxnsInput, ItemUncheckedCreateWithoutInventoryTxnsInput>
  }

  export type InventoryLocationCreateWithoutTxnsInput = {
    code: string
    name: string
    type: $Enums.LocationType
    machine?: MachineCreateNestedOneWithoutLocationInput
  }

  export type InventoryLocationUncheckedCreateWithoutTxnsInput = {
    id?: number
    code: string
    name: string
    type: $Enums.LocationType
    machineId?: number | null
  }

  export type InventoryLocationCreateOrConnectWithoutTxnsInput = {
    where: InventoryLocationWhereUniqueInput
    create: XOR<InventoryLocationCreateWithoutTxnsInput, InventoryLocationUncheckedCreateWithoutTxnsInput>
  }

  export type ProCreateWithoutInventoryTxnsInput = {
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    proPrefix?: ProPrefixCreateNestedOneWithoutProsInput
    fgItem?: ItemCreateNestedOneWithoutFgProsInput
    proses?: ProsesCreateNestedManyWithoutProInput
  }

  export type ProUncheckedCreateWithoutInventoryTxnsInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    proses?: ProsesUncheckedCreateNestedManyWithoutProInput
  }

  export type ProCreateOrConnectWithoutInventoryTxnsInput = {
    where: ProWhereUniqueInput
    create: XOR<ProCreateWithoutInventoryTxnsInput, ProUncheckedCreateWithoutInventoryTxnsInput>
  }

  export type ProsesCreateWithoutInventoryTxnsInput = {
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    pro: ProCreateNestedOneWithoutProsesInput
    machine?: MachineCreateNestedOneWithoutProsesInput
    outputItem?: ItemCreateNestedOneWithoutOutputProsesInput
    materials?: ProsesMaterialCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportCreateNestedManyWithoutProsesInput
  }

  export type ProsesUncheckedCreateWithoutInventoryTxnsInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
    materials?: ProsesMaterialUncheckedCreateNestedManyWithoutProsesInput
    productionReports?: ProductionReportUncheckedCreateNestedManyWithoutProsesInput
  }

  export type ProsesCreateOrConnectWithoutInventoryTxnsInput = {
    where: ProsesWhereUniqueInput
    create: XOR<ProsesCreateWithoutInventoryTxnsInput, ProsesUncheckedCreateWithoutInventoryTxnsInput>
  }

  export type ProductionReportCreateWithoutInventoryTxnsInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
    proses: ProsesCreateNestedOneWithoutProductionReportsInput
    createdBy?: UserCreateNestedOneWithoutProductionReportsInput
    checkedBy?: UserCreateNestedOneWithoutCheckedProductionReportsInput
  }

  export type ProductionReportUncheckedCreateWithoutInventoryTxnsInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportCreateOrConnectWithoutInventoryTxnsInput = {
    where: ProductionReportWhereUniqueInput
    create: XOR<ProductionReportCreateWithoutInventoryTxnsInput, ProductionReportUncheckedCreateWithoutInventoryTxnsInput>
  }

  export type ItemUpsertWithoutInventoryTxnsInput = {
    update: XOR<ItemUpdateWithoutInventoryTxnsInput, ItemUncheckedUpdateWithoutInventoryTxnsInput>
    create: XOR<ItemCreateWithoutInventoryTxnsInput, ItemUncheckedCreateWithoutInventoryTxnsInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutInventoryTxnsInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutInventoryTxnsInput, ItemUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ItemUpdateWithoutInventoryTxnsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedItemsNestedInput
    material?: MaterialUpdateOneWithoutItemNestedInput
    fgPros?: ProUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutInventoryTxnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    material?: MaterialUncheckedUpdateOneWithoutItemNestedInput
    fgPros?: ProUncheckedUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUncheckedUpdateManyWithoutOutputItemNestedInput
  }

  export type InventoryLocationUpsertWithoutTxnsInput = {
    update: XOR<InventoryLocationUpdateWithoutTxnsInput, InventoryLocationUncheckedUpdateWithoutTxnsInput>
    create: XOR<InventoryLocationCreateWithoutTxnsInput, InventoryLocationUncheckedCreateWithoutTxnsInput>
    where?: InventoryLocationWhereInput
  }

  export type InventoryLocationUpdateToOneWithWhereWithoutTxnsInput = {
    where?: InventoryLocationWhereInput
    data: XOR<InventoryLocationUpdateWithoutTxnsInput, InventoryLocationUncheckedUpdateWithoutTxnsInput>
  }

  export type InventoryLocationUpdateWithoutTxnsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    machine?: MachineUpdateOneWithoutLocationNestedInput
  }

  export type InventoryLocationUncheckedUpdateWithoutTxnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProUpsertWithoutInventoryTxnsInput = {
    update: XOR<ProUpdateWithoutInventoryTxnsInput, ProUncheckedUpdateWithoutInventoryTxnsInput>
    create: XOR<ProCreateWithoutInventoryTxnsInput, ProUncheckedCreateWithoutInventoryTxnsInput>
    where?: ProWhereInput
  }

  export type ProUpdateToOneWithWhereWithoutInventoryTxnsInput = {
    where?: ProWhereInput
    data: XOR<ProUpdateWithoutInventoryTxnsInput, ProUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ProUpdateWithoutInventoryTxnsInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proPrefix?: ProPrefixUpdateOneWithoutProsNestedInput
    fgItem?: ItemUpdateOneWithoutFgProsNestedInput
    proses?: ProsesUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateWithoutInventoryTxnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProsesUpsertWithoutInventoryTxnsInput = {
    update: XOR<ProsesUpdateWithoutInventoryTxnsInput, ProsesUncheckedUpdateWithoutInventoryTxnsInput>
    create: XOR<ProsesCreateWithoutInventoryTxnsInput, ProsesUncheckedCreateWithoutInventoryTxnsInput>
    where?: ProsesWhereInput
  }

  export type ProsesUpdateToOneWithWhereWithoutInventoryTxnsInput = {
    where?: ProsesWhereInput
    data: XOR<ProsesUpdateWithoutInventoryTxnsInput, ProsesUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ProsesUpdateWithoutInventoryTxnsInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    machine?: MachineUpdateOneWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutInventoryTxnsInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type ProductionReportUpsertWithoutInventoryTxnsInput = {
    update: XOR<ProductionReportUpdateWithoutInventoryTxnsInput, ProductionReportUncheckedUpdateWithoutInventoryTxnsInput>
    create: XOR<ProductionReportCreateWithoutInventoryTxnsInput, ProductionReportUncheckedCreateWithoutInventoryTxnsInput>
    where?: ProductionReportWhereInput
  }

  export type ProductionReportUpdateToOneWithWhereWithoutInventoryTxnsInput = {
    where?: ProductionReportWhereInput
    data: XOR<ProductionReportUpdateWithoutInventoryTxnsInput, ProductionReportUncheckedUpdateWithoutInventoryTxnsInput>
  }

  export type ProductionReportUpdateWithoutInventoryTxnsInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    proses?: ProsesUpdateOneRequiredWithoutProductionReportsNestedInput
    createdBy?: UserUpdateOneWithoutProductionReportsNestedInput
    checkedBy?: UserUpdateOneWithoutCheckedProductionReportsNestedInput
  }

  export type ProductionReportUncheckedUpdateWithoutInventoryTxnsInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportCreateManyCreatedByInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportCreateManyCheckedByInput = {
    id?: string
    prosesId: number
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
  }

  export type ItemCreateManyCreatedByInput = {
    id?: number
    code: string
    name: string
    kind: $Enums.ItemKind
    status?: $Enums.ItemStatus
    baseUom?: string | null
    createdFrom?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductionReportUpdateWithoutCreatedByInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    proses?: ProsesUpdateOneRequiredWithoutProductionReportsNestedInput
    checkedBy?: UserUpdateOneWithoutCheckedProductionReportsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type ProductionReportUpdateWithoutCheckedByInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    proses?: ProsesUpdateOneRequiredWithoutProductionReportsNestedInput
    createdBy?: UserUpdateOneWithoutProductionReportsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateWithoutCheckedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateManyWithoutCheckedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    prosesId?: IntFieldUpdateOperationsInput | number
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type ItemUpdateWithoutCreatedByInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUpdateOneWithoutItemNestedInput
    fgPros?: ProUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateWithoutCreatedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutItemMasterNestedInput
    material?: MaterialUncheckedUpdateOneWithoutItemNestedInput
    fgPros?: ProUncheckedUpdateManyWithoutFgItemNestedInput
    outputProses?: ProsesUncheckedUpdateManyWithoutOutputItemNestedInput
  }

  export type ItemUncheckedUpdateManyWithoutCreatedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    kind?: EnumItemKindFieldUpdateOperationsInput | $Enums.ItemKind
    status?: EnumItemStatusFieldUpdateOperationsInput | $Enums.ItemStatus
    baseUom?: NullableStringFieldUpdateOperationsInput | string | null
    createdFrom?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProsesCreateManyMachineInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
  }

  export type ProsesUpdateWithoutMachineInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutMachineInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateManyWithoutMachineInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProsesMaterialCreateManyMaterialInput = {
    id?: number
    prosesId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUpdateWithoutMaterialInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    proses?: ProsesUpdateOneRequiredWithoutMaterialsNestedInput
  }

  export type ProsesMaterialUncheckedUpdateWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    prosesId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUncheckedUpdateManyWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    prosesId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InventoryTxnCreateManyItemMasterInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    locationId: number
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ProCreateManyFgItemInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    proPrefixId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProsesCreateManyOutputItemInput = {
    id?: number
    proId: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
  }

  export type InventoryTxnUpdateWithoutItemMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput
    pro?: ProUpdateOneWithoutInventoryTxnsNestedInput
    proses?: ProsesUpdateOneWithoutInventoryTxnsNestedInput
    productionReport?: ProductionReportUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateWithoutItemMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyWithoutItemMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProUpdateWithoutFgItemInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proPrefix?: ProPrefixUpdateOneWithoutProsNestedInput
    proses?: ProsesUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateWithoutFgItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateManyWithoutFgItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    proPrefixId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProsesUpdateWithoutOutputItemInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    pro?: ProUpdateOneRequiredWithoutProsesNestedInput
    machine?: MachineUpdateOneWithoutProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutOutputItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateManyWithoutOutputItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    proId?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProCreateManyProPrefixInput = {
    id?: number
    proNumber: string
    productName: string
    partNumber?: string | null
    qtyPoPcs: number
    startDate?: Date | string | null
    status?: $Enums.ProStatus
    type?: $Enums.ProType
    autoShiftExpansion?: boolean
    fgItemId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProUpdateWithoutProPrefixInput = {
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fgItem?: ItemUpdateOneWithoutFgProsNestedInput
    proses?: ProsesUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateWithoutProPrefixInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proses?: ProsesUncheckedUpdateManyWithoutProNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProNestedInput
  }

  export type ProUncheckedUpdateManyWithoutProPrefixInput = {
    id?: IntFieldUpdateOperationsInput | number
    proNumber?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    qtyPoPcs?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProStatusFieldUpdateOperationsInput | $Enums.ProStatus
    type?: EnumProTypeFieldUpdateOperationsInput | $Enums.ProType
    autoShiftExpansion?: BoolFieldUpdateOperationsInput | boolean
    fgItemId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProsesCreateManyProInput = {
    id?: number
    orderNo: number
    up?: number | null
    estimatedShifts?: number | null
    startDate?: Date | string | null
    machineId?: number | null
    partNumber?: string | null
    batchNo?: string | null
    outputItemId?: number | null
  }

  export type InventoryTxnCreateManyProInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ProsesUpdateWithoutProInput = {
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    machine?: MachineUpdateOneWithoutProsesNestedInput
    outputItem?: ItemUpdateOneWithoutOutputProsesNestedInput
    materials?: ProsesMaterialUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateWithoutProInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
    materials?: ProsesMaterialUncheckedUpdateManyWithoutProsesNestedInput
    productionReports?: ProductionReportUncheckedUpdateManyWithoutProsesNestedInput
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProsesNestedInput
  }

  export type ProsesUncheckedUpdateManyWithoutProInput = {
    id?: IntFieldUpdateOperationsInput | number
    orderNo?: IntFieldUpdateOperationsInput | number
    up?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedShifts?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    machineId?: NullableIntFieldUpdateOperationsInput | number | null
    partNumber?: NullableStringFieldUpdateOperationsInput | string | null
    batchNo?: NullableStringFieldUpdateOperationsInput | string | null
    outputItemId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type InventoryTxnUpdateWithoutProInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemMaster?: ItemUpdateOneWithoutInventoryTxnsNestedInput
    location?: InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput
    proses?: ProsesUpdateOneWithoutInventoryTxnsNestedInput
    productionReport?: ProductionReportUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateWithoutProInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProsesMaterialCreateManyProsesInput = {
    id?: number
    materialId: number
    qtyReq: Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportCreateManyProsesInput = {
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
    qtyReject?: Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: number
    notes?: string | null
    othersNote?: string | null
    adminNote?: string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.ReportStatus
    rejectionNote?: string | null
    checkedById?: string | null
    checkedAt?: Date | string | null
    voidedAt?: Date | string | null
    voidedById?: string | null
    voidReason?: string | null
    stockPostedAt?: Date | string | null
    inputWipQty?: Decimal | DecimalJsLike | number | string | null
  }

  export type InventoryTxnCreateManyProsesInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ProsesMaterialUpdateWithoutProsesInput = {
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    material?: MaterialUpdateOneRequiredWithoutProsesMaterialsNestedInput
  }

  export type ProsesMaterialUncheckedUpdateWithoutProsesInput = {
    id?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProsesMaterialUncheckedUpdateManyWithoutProsesInput = {
    id?: IntFieldUpdateOperationsInput | number
    materialId?: IntFieldUpdateOperationsInput | number
    qtyReq?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProductionReportUpdateWithoutProsesInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdBy?: UserUpdateOneWithoutProductionReportsNestedInput
    checkedBy?: UserUpdateOneWithoutCheckedProductionReportsNestedInput
    inventoryTxns?: InventoryTxnUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateWithoutProsesInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    inventoryTxns?: InventoryTxnUncheckedUpdateManyWithoutProductionReportNestedInput
  }

  export type ProductionReportUncheckedUpdateManyWithoutProsesInput = {
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
    qtyReject?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rejectBreakdown?: NullableJsonNullValueInput | InputJsonValue
    downtimeBreakdown?: NullableJsonNullValueInput | InputJsonValue
    totalDowntime?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    othersNote?: NullableStringFieldUpdateOperationsInput | string | null
    adminNote?: NullableStringFieldUpdateOperationsInput | string | null
    metaData?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    rejectionNote?: NullableStringFieldUpdateOperationsInput | string | null
    checkedById?: NullableStringFieldUpdateOperationsInput | string | null
    checkedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedById?: NullableStringFieldUpdateOperationsInput | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    stockPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputWipQty?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type InventoryTxnUpdateWithoutProsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemMaster?: ItemUpdateOneWithoutInventoryTxnsNestedInput
    location?: InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput
    pro?: ProUpdateOneWithoutInventoryTxnsNestedInput
    productionReport?: ProductionReportUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateWithoutProsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProsesInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnCreateManyProductionReportInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    locationId: number
    proId?: number | null
    prosesId?: number | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnUpdateWithoutProductionReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemMaster?: ItemUpdateOneWithoutInventoryTxnsNestedInput
    location?: InventoryLocationUpdateOneRequiredWithoutTxnsNestedInput
    pro?: ProUpdateOneWithoutInventoryTxnsNestedInput
    proses?: ProsesUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateWithoutProductionReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyWithoutProductionReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnCreateManyLocationInput = {
    id?: string
    groupId?: string
    date?: Date | string
    type: $Enums.TxnType
    itemId: string
    qty: Decimal | DecimalJsLike | number | string
    itemMasterId?: number | null
    proId?: number | null
    prosesId?: number | null
    productionReportId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InventoryTxnUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemMaster?: ItemUpdateOneWithoutInventoryTxnsNestedInput
    pro?: ProUpdateOneWithoutInventoryTxnsNestedInput
    proses?: ProsesUpdateOneWithoutInventoryTxnsNestedInput
    productionReport?: ProductionReportUpdateOneWithoutInventoryTxnsNestedInput
  }

  export type InventoryTxnUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryTxnUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumTxnTypeFieldUpdateOperationsInput | $Enums.TxnType
    itemId?: StringFieldUpdateOperationsInput | string
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    itemMasterId?: NullableIntFieldUpdateOperationsInput | number | null
    proId?: NullableIntFieldUpdateOperationsInput | number | null
    prosesId?: NullableIntFieldUpdateOperationsInput | number | null
    productionReportId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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