import { CodeFile } from '../types';

export const androidCodeAssets: CodeFile[] = [
  {
    name: 'GitHub Build Workflow',
    path: '.github/workflows/android-build.yml',
    language: 'yaml',
    description: 'Automatiza o build do app gerando o arquivo APK assinado/não assinado diretamente em cada push na branch main.',
    content: `name: Android CI Build

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    name: Build APK & Test
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code Base
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'zulu'
        cache: gradle

    - name: Grant Execute Permission to Gradle Wrapper
      run: chmod +x gradlew

    - name: Build Debug APK
      run: ./gradlew assembleDebug --no-daemon

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: driver-assistant-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 7
`
  },
  {
    name: 'Accessibility Service (Parser)',
    path: 'app/src/main/java/com/driver/assistant/InDriveAccessibilityService.kt',
    language: 'kotlin',
    description: 'Serviço de Acessibilidade Android que escuta o aplicativo inDrive em segundo plano, lê as informações de novas corridas da tela, calcula a eficiência e transmite para o nosso mapa em tempo real.',
    content: `package com.driver.assistant

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import java.util.regex.Pattern

/**
 * Serviço responsável por ler dados na tela do inDrive via API de Acessibilidade do Android.
 * Respeita as diretrizes de acessibilidade e evita toques indesejados.
 */
class InDriveAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "InDriveService"
        const val ACTION_NEW_RIDE = "com.driver.assistant.NEW_RIDE"
        const val EXTRA_PRICE = "extra_price"
        const val EXTRA_DISTANCE = "extra_distance"
        const val EXTRA_PICKUP = "extra_pickup"
        const val EXTRA_DESTINATION = "extra_destination"
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        // Verifica se o evento vem do aplicativo inDrive
        val packageName = event.packageName?.toString() ?: return
        if (!packageName.contains("indriver") && !packageName.contains("com.indriver")) {
            return
        }

        val rootNode = rootInActiveWindow ?: return
        parseScreenNodes(rootNode)
    }

    private fun parseScreenNodes(node: AccessibilityNodeInfo) {
        // Busca recursivamente por informações de preços, distâncias e destinos
        val nodeText = node.text?.toString() ?: ""
        
        if (nodeText.isNotEmpty()) {
            // Exemplo de Regex para encontrar valores em Reais (R$ 35,00)
            val priceMatcher = Pattern.compile("R\\\\$\\\\s*(\\\\d+([.,]\\\\d{2})?)").matcher(nodeText)
            if (priceMatcher.find()) {
                val valueStr = priceMatcher.group(1)?.replace(",", ".")
                val price = valueStr?.toDoubleOrNull() ?: 0.0
                
                // Exemplo de Regex para quilometragem (12.4 km ou 8,5 km)
                val distanceMatcher = Pattern.compile("(\\\\d+([.,]\\\\d+)?)\\\\s*km").matcher(nodeText)
                if (distanceMatcher.find()) {
                    val distStr = distanceMatcher.group(1)?.replace(",", ".")
                    val distance = distStr?.toDoubleOrNull() ?: 0.0
                    
                    if (price > 0 && distance > 0) {
                        broadcastNewRide(price, distance, "Origem detectada", "Destino detectado")
                    }
                }
            }
        }

        // Navega nos filhos recursivamente
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (child != null) {
                parseScreenNodes(child)
            }
        }
    }

    private fun broadcastNewRide(price: Double, distance: Double, pickup: String, destination: String) {
        val intent = Intent(ACTION_NEW_RIDE).apply {
            putExtra(EXTRA_PRICE, price)
            putExtra(EXTRA_DISTANCE, distance)
            putExtra(EXTRA_PICKUP, pickup)
            putExtra(EXTRA_DESTINATION, destination)
            setPackage(packageName)
        }
        sendBroadcast(intent)
        Log.d(TAG, "Nova corrida transmitida: R$ $price por $distance km")
    }

    override fun onInterrupt() {
        Log.e(TAG, "Serviço interrompido.")
    }
}
`
  },
  {
    name: 'Main Activity',
    path: 'app/src/main/java/com/driver/assistant/MainActivity.kt',
    language: 'kotlin',
    description: 'Activity principal que exibe a interface móvel unificada. Inicializa os SDKs de mapa (Google Maps, OpenStreetMap e Mapbox) de acordo com o provedor ativo, e processa os filtros de ganho ideal.',
    content: `package com.driver.assistant

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.driver.assistant.databinding.ActivityMainBinding
import com.mapbox.maps.MapView
import com.mapbox.maps.Style
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.views.MapView as OsmMapView

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var activeMapProvider: String = "google" // "google", "osm" ou "mapbox"
    private var minPriceFilter: Double = 15.0
    private var minValPerKmFilter: Double = 2.0

    private val rideReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val price = intent.getDoubleExtra(InDriveAccessibilityService.EXTRA_PRICE, 0.0)
            val distance = intent.getDoubleExtra(InDriveAccessibilityService.EXTRA_DISTANCE, 0.0)
            val pickup = intent.getStringExtra(InDriveAccessibilityService.EXTRA_PICKUP) ?: ""
            val dest = intent.getStringExtra(InDriveAccessibilityService.EXTRA_DESTINATION) ?: ""
            
            processRideOpportunity(price, distance, pickup, dest)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState: Bundle?)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configura receptores de transmissão
        val filter = IntentFilter(InDriveAccessibilityService.ACTION_NEW_RIDE)
        registerReceiver(rideReceiver, filter, RECEIVER_EXPORTED)

        setupMapProviders()
        setupListeners()
    }

    private fun setupMapProviders() {
        // Inicializa o OSMDroid (necessário para OpenStreetMap)
        Configuration.getInstance().userAgentValue = packageName
        
        // Exemplo de alternância de mapa baseado na preferência do usuário
        binding.btnToggleMap.setOnClickListener {
            when (activeMapProvider) {
                "google" -> switchToOsm()
                "osm" -> switchToMapbox()
                "mapbox" -> switchToGoogle()
            }
        }
    }

    private fun switchToOsm() {
        activeMapProvider = "osm"
        Toast.makeText(this, "Carregando OpenStreetMap (Gratuito e Offline)", Toast.LENGTH_SHORT).show()
        // Oculta Google Maps / Mapbox, exibe OSM MapView
    }

    private fun switchToMapbox() {
        activeMapProvider = "mapbox"
        Toast.makeText(this, "Carregando Mapbox (Estilos Vetoriais Premium)", Toast.LENGTH_SHORT).show()
        // Oculta OSM / Google Maps, exibe Mapbox MapView
    }

    private fun switchToGoogle() {
        activeMapProvider = "google"
        Toast.makeText(this, "Carregando Google Maps (Trânsito em Tempo Real)", Toast.LENGTH_SHORT).show()
        // Oculta OSM / Mapbox, exibe Google Maps
    }

    private fun processRideOpportunity(price: Double, distance: Double, pickup: String, dest: String) {
        val valPerKm = price / distance
        if (price >= minPriceFilter && valPerKm >= minValPerKmFilter) {
            // Exibe notificação flutuante de alto ganho
            Toast.makeText(this, "✨ Corrida Altamente Lucrativa: R$ $price ($distance km)!", Toast.LENGTH_LONG).show()
            // Plota rota colorida no mapa ativo
            drawRouteOnActiveMap(pickup, dest)
        }
    }

    private fun drawRouteOnActiveMap(origin: String, destination: String) {
        // Lógica de plotagem de rotas coloridas com destaque
        // No Google Maps: usando Google Map PolylineOptions() com cores contrastantes
        // No Mapbox: usando LineString e GeoJsonSource
        // No OSM: usando Polyline no OSMDroid
    }

    fun openInDriveRide(rideId: String) {
        // Abre diretamente o aplicativo inDrive utilizando Intents ou Deep Linking
        val launchIntent = packageManager.getLaunchIntentForPackage("com.indriver.client")
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(launchIntent)
        } else {
            // Se não instalado, redireciona para a Play Store
            try {
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.indriver.client")))
            } catch (e: Exception) {
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.indriver.client")))
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(rideReceiver)
    }
}
`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Declaração de permissões de localização precisa e registro do Serviço de Acessibilidade Android, garantindo inicialização correta em segundo plano.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.driver.assistant">

    <!-- Permissões necessárias para leitura de GPS e conexão com APIs de mapas -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Driver Optimal Assistant"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Registro do Serviço de Acessibilidade -->
        <service
            android:name=".InDriveAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.view.accessibility.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.view.accessibility.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

    </application>
</manifest>
`
  },
  {
    name: 'Gradle dependencies',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Gerenciamento de dependências Kotlin do Gradle para importar as SDKs do Google Maps, OpenStreetMap (OsmDroid) e Mapbox para Android.',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.driver.assistant"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.driver.assistant"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")

    // 1. Google Maps SDK
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    implementation("com.google.android.gms:play-services-location:21.1.0")

    // 2. OpenStreetMap SDK (OSMDroid)
    implementation("org.osmdroid:osmdroid-android:6.1.18")

    // 3. Mapbox SDK v10 (Mapas vetoriais premium)
    implementation("com.mapbox.maps:android:10.16.1")
}
`
  }
];
