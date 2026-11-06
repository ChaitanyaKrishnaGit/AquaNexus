/**
 * Aqua Nexus — ESP32 Hardware Integration & MQTT Ingestion Architecture
 * Stable Telemetry JSON Schema, MQTT Broker Specs, and Live Packet Validator
 */

import React, { useState } from 'react';
import { 
  ESP32_TELEMETRY_JSON_SCHEMA, 
  MQTT_TOPIC_CONVENTION, 
  SAMPLE_ESP32_PAYLOAD, 
  validateEsp32Telemetry,
  TelemetryValidationResult
} from '../../services/esp32Schema';
import { 
  Cpu, 
  Radio, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';

export const Esp32BridgeSpec: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'validator' | 'topics'>('architecture');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [payloadInput, setPayloadInput] = useState<string>(SAMPLE_ESP32_PAYLOAD);
  const [validationResult, setValidationResult] = useState<TelemetryValidationResult | null>(() => 
    validateEsp32Telemetry(SAMPLE_ESP32_PAYLOAD)
  );

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(ESP32_TELEMETRY_JSON_SCHEMA, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const runValidation = () => {
    const res = validateEsp32Telemetry(payloadInput);
    setValidationResult(res);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0D1929]/95 backdrop-blur-md border border-[#38BDF8]/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#14B8A6]" />
            <h2 className="text-base font-bold text-[#F8FAFC]">
              ESP32 Telemetry & MQTT Ingestion Architecture
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Standardized hardware specification for physical catamaran floating robots.
          </p>
        </div>

        <div className="px-3 py-1 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-mono text-xs">
          STATUS: INGESTION SPECIFICATION READY (v1.0.0)
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#38BDF8]/15 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'architecture' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Hardware Architecture
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'schema' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          JSON Schema (RFC Draft 2020-12)
        </button>
        <button
          onClick={() => setActiveTab('validator')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'validator' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Live Packet Validator
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'topics' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          MQTT Topic Topology
        </button>
      </div>

      {/* Architecture Overview */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-2">
              <div className="text-xs font-bold text-[#4FDBC8] uppercase font-mono">
                1. Microcontroller Core
              </div>
              <ul className="text-xs text-[#DAE3F7] space-y-1 leading-relaxed">
                <li>• <strong>ESP32-WROOM-32D:</strong> Dual Xtensa 32-bit LX6 @ 240MHz.</li>
                <li>• <strong>FreeRTOS:</strong> Core 0 handles Wi-Fi/MQTT; Core 1 samples sensor ADC & PID motor controller.</li>
                <li>• <strong>Hardware Watchdog:</strong> 5-second automatic reboot timer prevents frozen firmware loops.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-2">
              <div className="text-xs font-bold text-[#38BDF8] uppercase font-mono">
                2. Limnology Probe Array
              </div>
              <ul className="text-xs text-[#DAE3F7] space-y-1 leading-relaxed">
                <li>• <strong>pH:</strong> Glass combination electrode with high-impedance amplifier (ADC Ch1).</li>
                <li>• <strong>DO:</strong> Galvanic membrane probe with thermistor temperature compensation (ADC Ch2).</li>
                <li>• <strong>Turbidity:</strong> 90° optical nephelometric infrared scattering sensor (ADC Ch3).</li>
                <li>• <strong>Temp:</strong> DS18B20 digital stainless probe on 1-Wire bus (GPIO 4).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-2">
              <div className="text-xs font-bold text-[#F59E0B] uppercase font-mono">
                3. Navigation & Power
              </div>
              <ul className="text-xs text-[#DAE3F7] space-y-1 leading-relaxed">
                <li>• <strong>GPS:</strong> u-blox NEO-6M via UART2 (NMEA GGA & RMC sentences).</li>
                <li>• <strong>Battery:</strong> 11.1V 3S LiPo (5200 mAh) with ADC voltage divider.</li>
                <li>• <strong>Solar:</strong> 18V 15W Monocrystalline deck panel with MPPT charge controller.</li>
                <li>• <strong>Motors:</strong> Twin 12V brushed DC with dual L298N H-bridge PWM steering.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#08111F] border border-[#38BDF8]/20 space-y-3">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              End-to-End Hardware Ingestion Pipeline
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="p-2 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#4FDBC8]">
                ESP32 Sensors & GPS
              </span>
              <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              <span className="p-2 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#38BDF8]">
                WiFi / Cellular 4G LTE
              </span>
              <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              <span className="p-2 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#818CF8]">
                MQTT Broker (Mosquitto/EMQX)
              </span>
              <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              <span className="p-2 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#F59E0B]">
                FastAPI Validation Layer
              </span>
              <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
              <span className="p-2 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#22C55E]">
                PostgreSQL & WebSocket Bus
              </span>
            </div>
          </div>
        </div>
      )}

      {/* JSON Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8] font-mono">
              Strict JSON Schema defining telemetry packet constraints:
            </span>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#111F30] border border-[#38BDF8]/30 text-[#38BDF8] hover:text-[#F8FAFC] text-xs font-mono"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied!' : 'Copy Schema JSON'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#08111F] border border-[#38BDF8]/20 font-mono text-[11px] text-[#DAE3F7] overflow-x-auto max-h-[480px]">
            {JSON.stringify(ESP32_TELEMETRY_JSON_SCHEMA, null, 2)}
          </pre>
        </div>
      )}

      {/* Live Packet Validator */}
      {activeTab === 'validator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8FAFC]">Input Raw Telemetry Packet (JSON):</span>
              <button
                onClick={() => setPayloadInput(SAMPLE_ESP32_PAYLOAD)}
                className="text-[10px] font-mono text-[#38BDF8] hover:underline"
              >
                Reset to Valid Sample
              </button>
            </div>
            <textarea
              value={payloadInput}
              onChange={e => setPayloadInput(e.target.value)}
              className="w-full h-80 p-3 rounded-xl bg-[#08111F] border border-[#38BDF8]/20 font-mono text-xs text-[#F8FAFC] focus:border-[#14B8A6] outline-none"
              spellCheck={false}
            />
            <button
              onClick={runValidation}
              className="w-full py-2.5 rounded-lg bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488] transition-colors"
            >
              Run Telemetry Schema Validation Test
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#F8FAFC]">Validation Test Output:</span>
            {validationResult && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                validationResult.isValid ? 'bg-[#22C55E]/10 border-[#22C55E]/40' : 'bg-[#EF4444]/10 border-[#EF4444]/40'
              }`}>
                <div className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                  )}
                  <div className="font-mono text-xs font-bold uppercase">
                    {validationResult.isValid ? 'VALID TELEMETRY PACKET' : 'SCHEMA VALIDATION FAILED'}
                  </div>
                </div>

                {validationResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[#EF4444] font-bold">Errors Found:</div>
                    {validationResult.errors.map((err, i) => (
                      <div key={i} className="text-xs text-[#EF4444] font-mono bg-[#08111F] p-2 rounded border border-[#EF4444]/20">
                        • {err}
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[#F59E0B] font-bold">Advisories:</div>
                    {validationResult.warnings.map((warn, i) => (
                      <div key={i} className="text-xs text-[#F59E0B] font-mono bg-[#08111F] p-2 rounded border border-[#F59E0B]/20">
                        ▲ {warn}
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.isValid && (
                  <div className="text-xs text-[#DAE3F7] leading-relaxed">
                    Packet conforms to Aqua Nexus v1.0.0 schema standard. Ready for real-time ingestion into time-series database.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MQTT Topic Topology */}
      {activeTab === 'topics' && (
        <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-4">
          <h3 className="text-xs font-bold text-[#F8FAFC] font-mono uppercase">
            MQTT 5.0 Topic Architecture & Security
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15">
              <span className="text-[#94A3B8]">Telemetry Ingestion: </span>
              <span className="text-[#4FDBC8] font-bold">{MQTT_TOPIC_CONVENTION.telemetryPublish}</span>
              <div className="text-[10px] text-[#94A3B8] mt-1">QoS 1 (At least once delivery) with periodic publish (3-5s).</div>
            </div>
            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15">
              <span className="text-[#94A3B8]">Critical Emergency Stop: </span>
              <span className="text-[#EF4444] font-bold">{MQTT_TOPIC_CONVENTION.emergencyStopSubscribe}</span>
              <div className="text-[10px] text-[#94A3B8] mt-1">QoS 2 (Exactly once delivery) with immediate ESP32 motor disengage.</div>
            </div>
            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15">
              <span className="text-[#94A3B8]">Waypoints & Mission Dispatch: </span>
              <span className="text-[#38BDF8] font-bold">{MQTT_TOPIC_CONVENTION.missionUpdateSubscribe}</span>
              <div className="text-[10px] text-[#94A3B8] mt-1">Retained message containing active route JSON.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
